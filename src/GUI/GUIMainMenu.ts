import { DataManager } from "../Data/Data";
import { GIT_REPO, ModVersion } from "../Definition";
import { GetText } from "../i18n";
import { MentionNotification } from "../MentionNotification";
import { OnlineNotification } from "../OnlineNotification";
import { AGUIScreen } from "./Widgets/AGUI";
import { MouseInRect } from "./IGUI";
import { IPoint } from "./IGUI";
import { IRect } from "./IGUI";
import { GUISettingScreen } from "./GUI";
import { ChatNotifyMenu } from "./ChatNotifyMenu";
import { OnlineNotifyMenu } from "./OnlineNotifyMenu";
import { setSubscreen } from "./GUI";
import { ExitButton, IconRoundButton, TextButton } from "./Widgets/Button";
import { BCCheckbox, BCPreferenceNotifications } from "./Widgets/BCWrapper";

const MainMenuBaseX = 300;
const MainMenuBaseY = 200;

const MainButtonWidth = 400;
const MainButtonHeight = 90;

const NotifySettingHeight = 64;
const SectionInternalPadding = 10;
const SectionPadding = 50;

const TitleText: IPoint = { x: MainMenuBaseX, y: 125 };
const ChatNotifyButton: IRect = { x: MainMenuBaseX, y: MainMenuBaseY, width: MainButtonWidth, height: MainButtonHeight };
const ChatNotifySetting: IPoint = { x: MainMenuBaseX, y: ChatNotifyButton.y + ChatNotifyButton.height + SectionInternalPadding };

const OnlineNotifyButton: IRect = { x: MainMenuBaseX, y: ChatNotifySetting.y + NotifySettingHeight + SectionPadding, width: MainButtonWidth, height: MainButtonHeight };
const OnlineNotifySetting: IPoint = { x: MainMenuBaseX, y: OnlineNotifyButton.y + OnlineNotifyButton.height + SectionInternalPadding };
const ChatNotifyChatMsg: IRect = { x: MainMenuBaseX, y: OnlineNotifySetting.y + NotifySettingHeight + SectionInternalPadding, width: 64, height: 64 };

const GitHubButton: IRect = {
    x: 1700,
    y: 800,
    width: 100,
    height: 100
};

// export class MainMenu extends GUISettingScreen {

//     Run(): void {
//         const data = DataManager.instance.data;
//         BCDrawExitButton();

//         ADrawText(TitleText, `${GetText(`notify_plus_setting`)} v${ModVersion}`, { shade: "Grey" });

//         ADrawTextButton(ChatNotifyButton, GetText(`button_mention_notify_setting`));
//         BCPreferenceNotificationsDrawSetting(ChatNotifySetting, GetText(`chat_notify_notification_setting`), data.chatNotify.setting);

//         ADrawTextButton(OnlineNotifyButton, GetText(`button_online_notify_setting`));
//         BCPreferenceNotificationsDrawSetting(OnlineNotifySetting, GetText(`online_notify_notification_setting`), data.onlineNotify.setting);
//         BCDrawCheckbox(ChatNotifyChatMsg, GetText("online_setting_chat_room_message"), data.onlineNotify.chatMsg);

//         ADrawRoundIconButton(GitHubButton, 15, "github");
//     }

//     Click(): void {
//         const data = DataManager.instance.data;

//         if (BCMouseInExitButton()) {
//             this.Exit();
//             return;
//         }

//         if (MouseInRect(ChatNotifyButton)) {
//             setSubscreen(new ChatNotifyMenu(this));
//             return;
//         }

//         if (MouseInRect(OnlineNotifyButton)) {
//             setSubscreen(new OnlineNotifyMenu(this));
//             return;
//         }

//         if (MouseInRect(ChatNotifyChatMsg)) {
//             data.onlineNotify.chatMsg = !data.onlineNotify.chatMsg;
//         }

//         if (MouseInRect(GitHubButton)) {
//             window.open(GIT_REPO, '_blank');
//         }

//         PreferenceNotificationsClickSetting(ChatNotifySetting.x, ChatNotifySetting.y, data.chatNotify.setting, MentionNotification.EventType);
//         PreferenceNotificationsClickSetting(OnlineNotifySetting.x, OnlineNotifySetting.y, data.onlineNotify.setting, OnlineNotification.EventType);
//         DataManager.instance.ServerStoreData();
//     }
// }

export class MainMenu extends AGUIScreen {
    constructor() {
        super(null);
        this._items = [
            new ExitButton(() => this.Exit()),
            new TextButton(ChatNotifyButton, GetText(`button_mention_notify_setting`), () => setSubscreen(new ChatNotifyMenu(this))),
            new BCPreferenceNotifications(ChatNotifySetting, GetText(`chat_notify_notification_setting`),
                DataManager.instance.data.chatNotify.setting, MentionNotification.EventType,
                { after: () => DataManager.instance.ServerStoreData() }),
            new TextButton(OnlineNotifyButton, GetText(`button_online_notify_setting`), () => setSubscreen(new OnlineNotifyMenu(this))),
            new BCPreferenceNotifications(OnlineNotifySetting, GetText(`online_notify_notification_setting`),
                DataManager.instance.data.onlineNotify.setting, OnlineNotification.EventType,
                { after: () => DataManager.instance.ServerStoreData() }),
            new BCCheckbox(ChatNotifyChatMsg, GetText("online_setting_chat_room_message"),
                () => DataManager.instance.data.onlineNotify.chatMsg,
                () => {
                    DataManager.instance.data.onlineNotify.chatMsg = !DataManager.instance.data.onlineNotify.chatMsg;
                    DataManager.instance.ServerStoreData();
                }),
            new IconRoundButton(GitHubButton, 15, "github", () => window.open(GIT_REPO, '_blank'))
        ]
    }
}