import { DataManager } from "../Data/Data";
import { GetText } from "../i18n";
import { MentionNotification } from "../MentionNotification";
import { ADrawText, BCDrawExitButton, BCMouseInExitButton } from "./Common";
import { GUISettingScreen } from "./GUI";
import { setSubscreen } from "./GUI";

const titleBaseX = 300;
const titleBaseY = 175;

export class ChatNotifyMenu extends GUISettingScreen {
    private static keys: (keyof NotifyPlusChatSetting)[] = ['public', 'friend', 'lover', 'sub', 'dom'];

    private static ElementID = (k: keyof NotifyPlusChatSetting) => `BCNotifyPlusChat_Input${k}`;

    private static StringListShow = (p: string[]) => {
        if (p.length === 0) return "";
        let result = JSON.stringify(p);
        return result.substring(1, result.length - 1);
    };

    private static ValidateInput = (input: string) => {
        let raw = `[${input}]`;

        const ValidateStringList = (input: any) => {
            if (!Array.isArray(input)) return undefined;
            if (!(input as any[]).every(_ => _ && typeof _ === 'string')) return undefined;
            return input as string[];
        };

        try {
            let d = JSON.parse(raw);
            return ValidateStringList(d);
        } catch {
            return undefined;
        }
    };

    prev: GUISettingScreen;

    constructor(prev: GUISettingScreen) {
        super();
        this.prev = prev;
    }

    Run(): void {
        const data = DataManager.instance.data;
        BCDrawExitButton();
        ADrawText({ x: titleBaseX, y: 125 }, GetText("chat_notify_setting"), { shade: "Gray" });

        PreferenceNotificationsDrawSetting(titleBaseX, titleBaseY, GetText("chat_notify_notification_setting"), data.chatNotify.setting);

        const inputBaseX = titleBaseX + 700;
        const inputBaseY = titleBaseY + 136;

        for (let i = 0; i < ChatNotifyMenu.keys.length; i++) {
            const k = ChatNotifyMenu.keys[i];
            const tY = inputBaseY + 90 * i;
            DrawText(GetText(`chat_setting_title_${k}`), titleBaseX, tY, "Black");
            let input = document.getElementById(ChatNotifyMenu.ElementID(k)) as HTMLInputElement | undefined;
            if (!input) {
                input = ElementCreateInput(ChatNotifyMenu.ElementID(k), "text", ChatNotifyMenu.StringListShow(data.chatNotify[k]), "256");
            }
            if (input) {
                ElementPosition(ChatNotifyMenu.ElementID(k), inputBaseX, tY, 1000, 64);
                if (!ChatNotifyMenu.ValidateInput(input.value)) {
                    DrawText(GetText(`chat_setting_input_invalid`), inputBaseX + 520, tY, "Red");
                }
            }
        }
    }

    Click(): void {
        const data = DataManager.instance.data;

        if (BCMouseInExitButton()) {
            for (let i = 0; i < ChatNotifyMenu.keys.length; i++) {
                const k = ChatNotifyMenu.keys[i];
                let input = document.getElementById(ChatNotifyMenu.ElementID(k)) as HTMLInputElement | undefined;
                if (input) {
                    let newL = ChatNotifyMenu.ValidateInput(input.value);
                    if (newL)
                        DataManager.instance.data.chatNotify[k] = newL;
                }
            }
            DataManager.instance.ServerStoreData();
            this.Exit();
            return;
        }

        PreferenceNotificationsClickSetting(titleBaseX, titleBaseY + 13, data.chatNotify.setting, MentionNotification.EventType);
        DataManager.instance.ServerStoreData();
    }

    Unload(): void {
        ChatNotifyMenu.keys.forEach(_ => ElementRemove(ChatNotifyMenu.ElementID(_)));
    }

    Exit(): void {
        setSubscreen(this.prev);
    }
}

