import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "../Data/Data";
import { DebugMode, ModVersion } from "../Definition";
import { Localization } from "../Lang";
import { MentionNotification } from "../MentionNotification";
import { OnlineNotification } from "../OnlineNotification";

export abstract class GUISettingScreen {
    Run() { }
    Click() { }
    Exit() { setSubscreen(null); }
    Unload() { }
}


export class ChatNotifyMenu extends GUISettingScreen {
    private static keys: (keyof NotifyPlusChatSetting)[] = ['public', 'friend', 'lover', 'sub', 'dom'];

    private static ElementID = (k: keyof NotifyPlusChatSetting) => `BCNotifyPlusChat_Input${k}`;

    private static StringListShow = (p: string[]) => {
        if (p.length === 0) return "";
        let result = JSON.stringify(p);
        return result.substring(1, result.length - 1);
    }

    private static ValidateInput = (input: string) => {
        let raw = `[${input}]`;

        const ValidateStringList = (input: any) => {
            if (!Array.isArray(input)) return undefined;
            if (!(input as any[]).every(_ => _ && typeof _ === 'string')) return undefined;
            return input as string[];
        }

        try {
            let d = JSON.parse(raw);
            return ValidateStringList(d);
        } catch {
            return undefined;
        }
    }

    prev: GUISettingScreen;

    constructor(prev: GUISettingScreen) {
        super();
        this.prev = prev;
    }

    Run(): void {
        const data = DataManager.instance.data;
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
        const titleBaseX = 400;
        const titleBaseY = 175;
        DrawText(Localization.GetText("chat_notify_setting"), titleBaseX, 125, "Black", "Gray");
        PreferenceNotificationsDrawSetting(titleBaseX, titleBaseY, Localization.GetText("chat_notify_notification_setting"), data.chatNotify.setting);

        const inputBaseX = titleBaseX + 700;
        const inputBaseY = titleBaseY + 136;

        for (let i = 0; i < ChatNotifyMenu.keys.length; i++) {
            const k = ChatNotifyMenu.keys[i];
            const tY = inputBaseY + 90 * i;
            DrawText(Localization.GetText(`chat_setting_title_${k}`), titleBaseX, tY, "Black", "Gray");
            let input = document.getElementById(ChatNotifyMenu.ElementID(k)) as HTMLInputElement | undefined;
            if (!input) {
                input = ElementCreateInput(ChatNotifyMenu.ElementID(k), "text", ChatNotifyMenu.StringListShow(data.chatNotify[k]), "256");
            }
            if (input) {
                ElementPosition(ChatNotifyMenu.ElementID(k), inputBaseX, tY, 1000, 64);
                if (!ChatNotifyMenu.ValidateInput(input.value)) {
                    DrawText(Localization.GetText(`chat_setting_input_invalid`), inputBaseX + 520, tY, "Red", "Gray");
                }
            }
        }
    }

    Click(): void {
        const data = DataManager.instance.data;
        const titleBaseX = 400;
        const titleBaseY = 200;
        const divY = 140;

        if (MouseIn(1815, 75, 90, 90)) {
            for (let i = 0; i < ChatNotifyMenu.keys.length; i++) {
                const k = ChatNotifyMenu.keys[i];
                let input = document.getElementById(ChatNotifyMenu.ElementID(k)) as HTMLInputElement | undefined;
                if (input) {
                    let newL = ChatNotifyMenu.ValidateInput(input.value);
                    if (newL)
                        DataManager.instance.data.chatNotify[k] = newL;
                }
            }
            this.Exit();
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


export class OnlineNotifyMenu extends GUISettingScreen {
    prev: GUISettingScreen;

    constructor(prev: GUISettingScreen) {
        super();
        this.prev = prev;
    }

    pageNum: number = 0;
    lastErr: boolean = false;

    Load(): void {
        this.pageNum = 0;
        this.lastErr = false;
    }

    Run(): void {
        const data = DataManager.instance.data;
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
        const titleBaseX = 400;
        const titleBaseY = 175;
        DrawText(Localization.GetText("online_notify_setting"), titleBaseX, 125, "Black", "Gray");
        PreferenceNotificationsDrawSetting(titleBaseX, titleBaseY, Localization.GetText("online_notify_notification_setting"), data.onlineNotify.setting);

        const divX = 320;

        DrawCheckbox(titleBaseX + 600, titleBaseY, 64, 64, Localization.GetText("online_setting_chat_room_message"), data.onlineNotify.chatMsg);

        DrawCheckbox(titleBaseX + divX * 0, titleBaseY + 100, 64, 64, Localization.GetText("online_setting_check_friend"), data.onlineNotify.notifies.friend);
        DrawCheckbox(titleBaseX + divX * 1, titleBaseY + 100, 64, 64, Localization.GetText("online_setting_check_lover"), data.onlineNotify.notifies.lover);
        DrawCheckbox(titleBaseX + divX * 2, titleBaseY + 100, 64, 64, Localization.GetText("online_setting_check_sub"), data.onlineNotify.notifies.sub);
        DrawCheckbox(titleBaseX + divX * 3, titleBaseY + 100, 64, 64, Localization.GetText("online_setting_check_dom"), data.onlineNotify.notifies.dom);


        MainCanvas.textAlign = "left";
        MainCanvas.fillStyle = "#eeeeee";
        const table_titleY = titleBaseY + 200;
        MainCanvas.fillRect(titleBaseX, table_titleY, 1200, 64);
        MainCanvas.textAlign = "center";

        const tableBaseX = titleBaseX + 180;

        DrawText(Localization.GetText("online_notify_setting_col_membernum"), tableBaseX, table_titleY + 34, "Black");
        DrawText(Localization.GetText("online_notify_setting_col_name"), tableBaseX + 240, table_titleY + 34, "Black");
        DrawText(Localization.GetText("online_notify_setting_col_online"), tableBaseX + 520, table_titleY + 34, "Black");
        DrawText(Localization.GetText("online_notify_setting_col_offline"), tableBaseX + 720, table_titleY + 34, "Black");

        const ItemPerPage = 5;
        const ContentLen = data.onlineNotify.notifies.spec.length;
        const MaxPage = Math.ceil(data.onlineNotify.notifies.spec.length / ItemPerPage);
        if (this.pageNum >= MaxPage) this.pageNum = MaxPage - 1;
        if (this.pageNum < 0) this.pageNum = 0;

        for (let i = 0; i < ItemPerPage; i++) {
            const id = i + ItemPerPage * this.pageNum;
            if (id >= ContentLen) continue;

            const Setting = data.onlineNotify.notifies.spec[id] as NotifyPlusSpecV2;
            const Name = (Player && Player.FriendNames && Player.FriendNames.get(Setting.MemberNumber)) || "Unknown"

            const thisY = table_titleY + 98 + i * 70;
            DrawText("" + Setting.MemberNumber, tableBaseX, thisY, "Black");
            DrawText(Name, tableBaseX + 240, thisY, "Black");
            DrawCheckbox(tableBaseX + 480, thisY - 32, 64, 64, "", Setting.enableOnline);
            DrawCheckbox(tableBaseX + 680, thisY - 32, 64, 64, "", Setting.enableOffline);
            DrawButton(tableBaseX + 880, thisY - 32, 64, 64, "X", "White", undefined, Localization.GetText('online_notify_remove_hint'));
        }

        DrawBackNextButton(titleBaseX + 900, titleBaseY + 638, 300, 64, `${TextGet("Page")} ${this.pageNum + 1} / ${MaxPage}`, "White", "", () => "", () => "");

        const input_id = 'BCNotifyPlus_Online_Setting_input';
        let input = document.getElementById(input_id) as HTMLInputElement | undefined;
        if (!input) {
            input = ElementCreateInput(input_id, "text", "", "256");
        }
        if (input) {
            ElementPosition(input_id, titleBaseX + 150, titleBaseY + 667, 300, 60);
        }
        DrawButton(titleBaseX + 300, titleBaseY + 638, 180, 64, Localization.GetText("online_notify_setting_add"), "White", undefined, Localization.GetText('online_notify_add_hint'));

        if (this.lastErr) {
            MainCanvas.textAlign = "left";
            DrawText(Localization.GetText("online_notify_cant_find"), titleBaseX, titleBaseY + 740, "Red");
            MainCanvas.textAlign = "center";
        }
    }

    Click(): void {
        const data = DataManager.instance.data;
        const titleBaseX = 400;
        const titleBaseY = 175;
        const divY = 140;

        if (MouseIn(1815, 75, 90, 90)) {
            this.Exit();
        }

        if (MouseIn(titleBaseX + 600, titleBaseY, 64, 64))
            data.onlineNotify.chatMsg = !data.onlineNotify.chatMsg;

        const divX = 320;
        if (MouseIn(titleBaseX + divX * 0, titleBaseY + 100, 64, 64))
            data.onlineNotify.notifies.friend = !data.onlineNotify.notifies.friend;
        if (MouseIn(titleBaseX + divX * 1, titleBaseY + 100, 64, 64))
            data.onlineNotify.notifies.lover = !data.onlineNotify.notifies.lover;
        if (MouseIn(titleBaseX + divX * 2, titleBaseY + 100, 64, 64))
            data.onlineNotify.notifies.sub = !data.onlineNotify.notifies.sub;
        if (MouseIn(titleBaseX + divX * 3, titleBaseY + 100, 64, 64))
            data.onlineNotify.notifies.dom = !data.onlineNotify.notifies.dom;

        PreferenceNotificationsClickSetting(titleBaseX, titleBaseY + 13, data.onlineNotify.setting, OnlineNotification.EventType);

        const ItemPerPage = 5;
        const ContentLen = data.onlineNotify.notifies.spec.length;
        const MaxPage = Math.ceil(data.onlineNotify.notifies.spec.length / ItemPerPage);
        const table_titleY = titleBaseY + 200;
        if (MouseIn(titleBaseX + 900, titleBaseY + 638, 150, 64)) {
            this.pageNum--;
            this.pageNum = Math.max(this.pageNum, 0);
        } else if (MouseIn(titleBaseX + 1050, titleBaseY + 638, 150, 64)) {
            this.pageNum++;
            this.pageNum = Math.min(this.pageNum, MaxPage);
        }

        const tableBaseX = titleBaseX + 180;
        for (let i = 0; i < ItemPerPage; i++) {
            const id = i + ItemPerPage * this.pageNum;
            if (id >= ContentLen) continue;

            const thisY = table_titleY + 98 + i * 70;
            const Setting = data.onlineNotify.notifies.spec[id] as NotifyPlusSpecV2;
            if (MouseIn(tableBaseX + 480, thisY - 32, 64, 64)) {
                Setting.enableOnline = !Setting.enableOnline;
            }
            if (MouseIn(tableBaseX + 680, thisY - 32, 64, 64)) {
                Setting.enableOffline = !Setting.enableOffline;
            }
            if (MouseIn(tableBaseX + 880, thisY - 32, 64, 64)) {
                data.onlineNotify.notifies.spec.splice(id, 1);
            }
        }

        if (MouseIn(titleBaseX + 300, titleBaseY + 625, 180, 64)) {
            const input_id = 'BCNotifyPlus_Online_Setting_input';
            let input = document.getElementById(input_id) as HTMLInputElement | undefined;
            if (input && input.value) {
                try {
                    let newL = Number.parseInt(input.value);
                    if (Player && Player.FriendNames) {
                        let d = Player.FriendNames.get(newL);
                        if (d !== undefined) {
                            let nid = data.onlineNotify.notifies.spec.findIndex(_ => _.MemberNumber === newL);
                            if (nid < 0)
                                data.onlineNotify.notifies.spec.push({ MemberNumber: newL, enable: true });
                            else {
                                this.pageNum = Math.floor(nid / ItemPerPage);
                            }

                        }
                        else
                            this.lastErr = true;
                    }
                    else
                        this.lastErr = true;
                } catch {
                    this.lastErr = true;
                }
            }
            ElementValue(input_id, "");
        }


        DataManager.instance.ServerStoreData();
    }

    Unload(): void {
        const input_id = 'BCNotifyPlus_Online_Setting_input';
        ElementRemove(input_id);
    }

    Exit(): void {
        setSubscreen(this.prev);
    }
}

export class GUIMainMenu extends GUISettingScreen {

    Run(): void {
        const data = DataManager.instance.data;
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
        const titleBaseX = 400;
        const titleBaseY = 200;
        DrawText(Localization.GetText(`notify_plus_setting`), titleBaseX, 125, "Black", "Gray");
        DrawText(`v${ModVersion}`, titleBaseX + 400, 125, "Black", "Gray");

        DrawButton(titleBaseX, titleBaseY, 400, 90, "", "White");
        DrawTextFit(Localization.GetText(`button_mention_notify_setting`), titleBaseX + 50, titleBaseY + 45, 400, "Black");
        PreferenceNotificationsDrawSetting(titleBaseX + 440, titleBaseY + 13, Localization.GetText(`chat_notify_notification_setting`), data.chatNotify.setting);

        const divY = 140;
        DrawButton(titleBaseX, titleBaseY + divY, 400, 90, "", "White");
        DrawTextFit(Localization.GetText(`button_online_notify_setting`), titleBaseX + 50, titleBaseY + 45 + divY, 400, "Black");
        PreferenceNotificationsDrawSetting(titleBaseX + 440, titleBaseY + 13 + divY, Localization.GetText(`online_notify_notification_setting`), data.onlineNotify.setting);
        DrawCheckbox(titleBaseX + 1000, titleBaseY + 13 + divY, 64, 64, Localization.GetText("online_setting_chat_room_message"), data.onlineNotify.chatMsg);
    }

    Click(): void {

        const data = DataManager.instance.data;
        const titleBaseX = 400;
        const titleBaseY = 200;
        const divY = 140;

        if (MouseIn(1815, 75, 90, 90)) {
            this.Exit();
            return;
        }

        if (MouseIn(titleBaseX, titleBaseY, 400, 90)) {
            setSubscreen(new ChatNotifyMenu(this));
        }

        if (MouseIn(titleBaseX, titleBaseY + divY, 400, 90)) {
            setSubscreen(new OnlineNotifyMenu(this));
        }

        if (MouseIn(titleBaseX + 1000, titleBaseY + 13 + divY, 64, 64)) {
            data.onlineNotify.chatMsg = !data.onlineNotify.chatMsg;
        }

        PreferenceNotificationsClickSetting(titleBaseX + 440, titleBaseY + 13, data.chatNotify.setting, MentionNotification.EventType);
        PreferenceNotificationsClickSetting(titleBaseX + 440, titleBaseY + 13 + divY, data.onlineNotify.setting, OnlineNotification.EventType);
        DataManager.instance.ServerStoreData();
    }

    Unload(): void {
    }
}

export function getCurrentSubscreen(): GUISettingScreen | null {
    return GUISetting.instance && GUISetting.instance.currentScreen;
}

export function setSubscreen(subscreen: GUISettingScreen | null): void {
    if (GUISetting.instance) {
        GUISetting.instance.currentScreen = subscreen;
    }
}

export class GUISetting {
    static instance: GUISetting | null = null;

    private _currentScreen: GUISettingScreen | null = null;

    get currentScreen(): GUISettingScreen | null {
        return this._currentScreen;
    }

    set currentScreen(subscreen: GUISettingScreen | null) {
        if (this._currentScreen) {
            this._currentScreen.Unload();
        }
        this._currentScreen = subscreen;
    }

    constructor() {
        GUISetting.instance = this;
    }

    load(mod: ModSDKModAPI<any>) {
        mod.hookFunction("PreferenceSubscreenNotificationsRun", 10, (args, next) => {
            if (this._currentScreen) {
                MainCanvas.textAlign = "left";
                this._currentScreen.Run();
                MainCanvas.textAlign = "center";

                if (DebugMode) {
                    if (MouseX > 0 || MouseY > 0) {
                        MainCanvas.save();
                        MainCanvas.lineWidth = 1;
                        MainCanvas.strokeStyle = "red";
                        MainCanvas.beginPath();
                        MainCanvas.moveTo(0, MouseY);
                        MainCanvas.lineTo(2000, MouseY);
                        MainCanvas.moveTo(MouseX, 0);
                        MainCanvas.lineTo(MouseX, 1000);
                        MainCanvas.stroke();
                        MainCanvas.fillStyle = "black";
                        MainCanvas.strokeStyle = "white";
                        MainCanvas.fillRect(0, 950, 250, 50);
                        MainCanvas.strokeRect(0, 950, 250, 50);
                        DrawText(`X: ${MouseX} Y: ${MouseY}`, 125, 975, "white");
                        MainCanvas.restore();
                    }
                }

                return;
            }

            next(args);
            DrawButton(1815, 180, 90, 90, "", "White", "Icons/Notifications.png", Localization.GetText("notify_plus_setting_button_hint"));
        });

        mod.hookFunction("PreferenceSubscreenNotificationsClick", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Click();
                return;
            }

            if (MouseIn(1815, 180, 90, 90)) {
                this.currentScreen = new GUIMainMenu();
            } else {
                return next(args);
            }
        });

        mod.hookFunction("InformationSheetExit", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Exit();
                return;
            }

            return next(args);
        });
    }
}