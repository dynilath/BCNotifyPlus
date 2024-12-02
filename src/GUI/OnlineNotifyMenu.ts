import { DataManager } from "../Data/Data";
import { GetText } from "../i18n";
import { OnlineNotification } from "../OnlineNotification";
import { ADrawText, BCDrawExitButton } from "./Common";
import { GUISettingScreen } from "./GUI";
import { setSubscreen } from "./GUI";

const input_id = 'BCNotifyPlus_Online_Setting_input';
const titleBaseX = 400;
const titleBaseY = 175;

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
        BCDrawExitButton();
        ADrawText({ x: titleBaseX, y: 125 }, GetText("online_notify_setting"), { shade: "Gray" });

        PreferenceNotificationsDrawSetting(titleBaseX, titleBaseY, GetText("online_notify_notification_setting"), data.onlineNotify.setting);

        const divX = 320;

        DrawCheckbox(titleBaseX + 600, titleBaseY, 64, 64, GetText("online_setting_chat_room_message"), data.onlineNotify.chatMsg);

        DrawCheckbox(titleBaseX + divX * 0, titleBaseY + 100, 64, 64, GetText("online_setting_check_friend"), data.onlineNotify.notifies.friend);
        DrawCheckbox(titleBaseX + divX * 1, titleBaseY + 100, 64, 64, GetText("online_setting_check_lover"), data.onlineNotify.notifies.lover);
        DrawCheckbox(titleBaseX + divX * 2, titleBaseY + 100, 64, 64, GetText("online_setting_check_sub"), data.onlineNotify.notifies.sub);
        DrawCheckbox(titleBaseX + divX * 3, titleBaseY + 100, 64, 64, GetText("online_setting_check_dom"), data.onlineNotify.notifies.dom);


        MainCanvas.textAlign = "left";
        MainCanvas.fillStyle = "#eeeeee";
        const table_titleY = titleBaseY + 200;
        MainCanvas.fillRect(titleBaseX, table_titleY, 1200, 64);
        MainCanvas.textAlign = "center";

        const tableBaseX = titleBaseX + 180;

        DrawText(GetText("online_notify_setting_col_membernum"), tableBaseX, table_titleY + 34, "Black");
        DrawText(GetText("online_notify_setting_col_name"), tableBaseX + 240, table_titleY + 34, "Black");
        DrawText(GetText("online_notify_setting_col_online"), tableBaseX + 520, table_titleY + 34, "Black");
        DrawText(GetText("online_notify_setting_col_offline"), tableBaseX + 720, table_titleY + 34, "Black");

        const ItemPerPage = 5;
        const ContentLen = data.onlineNotify.notifies.spec.length;
        const MaxPage = Math.ceil(data.onlineNotify.notifies.spec.length / ItemPerPage);
        if (this.pageNum >= MaxPage) this.pageNum = MaxPage - 1;
        if (this.pageNum < 0) this.pageNum = 0;

        for (let i = 0; i < ItemPerPage; i++) {
            const id = i + ItemPerPage * this.pageNum;
            if (id >= ContentLen) continue;

            const Setting = data.onlineNotify.notifies.spec[id] as NotifyPlusSpecV2;
            const Name = (Player && Player.FriendNames && Player.FriendNames.get(Setting.MemberNumber)) || "Unknown";

            const thisY = table_titleY + 98 + i * 70;
            DrawText("" + Setting.MemberNumber, tableBaseX, thisY, "Black");
            DrawText(Name, tableBaseX + 240, thisY, "Black");
            DrawCheckbox(tableBaseX + 480, thisY - 32, 64, 64, "", Setting.enableOnline);
            DrawCheckbox(tableBaseX + 680, thisY - 32, 64, 64, "", Setting.enableOffline);
            DrawButton(tableBaseX + 880, thisY - 32, 64, 64, "X", "White", undefined, GetText('online_notify_remove_hint'));
        }

        DrawBackNextButton(titleBaseX + 900, titleBaseY + 638, 300, 64, `${TextGet("Page")} ${this.pageNum + 1} / ${MaxPage}`, "White", "", () => "", () => "");

        let input = document.getElementById(input_id) as HTMLInputElement | undefined;
        if (!input) {
            input = ElementCreateInput(input_id, "text", "", "256");
        }
        if (input) {
            ElementPosition(input_id, titleBaseX + 150, titleBaseY + 667, 300, 60);
        }
        DrawButton(titleBaseX + 300, titleBaseY + 638, 180, 64, GetText("online_notify_setting_add"), "White", undefined, GetText('online_notify_add_hint'));

        if (this.lastErr) {
            MainCanvas.textAlign = "left";
            DrawText(GetText("online_notify_cant_find"), titleBaseX, titleBaseY + 740, "Red");
            MainCanvas.textAlign = "center";
        }
    }

    Click(): void {
        const data = DataManager.instance.data;

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

        PreferenceNotificationsClickSetting(
          titleBaseX,
          titleBaseY + 13,
          data.onlineNotify.setting,
          OnlineNotification.EventType as NotificationEventType
        );

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
        ElementRemove(input_id);
    }

    Exit(): void {
        setSubscreen(this.prev);
    }
}
