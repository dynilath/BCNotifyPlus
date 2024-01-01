import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { _ } from "core-js";
import { ChatRoomLocalAction } from "./utils/ChatMessages";
import { Monitor } from "./utils/Monitor";
import { DataManager } from "./Data/Data";
import { Localization } from "./Lang";


function raiseOnlineNotify(name: string, id: number) {
    const data = DataManager.instance.data.onlineNotify;
    const content = Localization.GetText("notify_friend_online", { CHARANAME: name, CHARANUM: `${id}` });
    if (data.setting.AlertType !== 0) {
        NotificationRaise(OnlineNotification.EventType, { body: content, memberNumber: id, characterName: name });
    }
    if (data.chatMsg) ChatRoomLocalAction(content);
}

function raiseOfflineNotify(name: string, id: number) {
    const data = DataManager.instance.data.onlineNotify;
    const content = Localization.GetText("notify_friend_offline", { CHARANAME: name, CHARANUM: `${id}` });
    if (data.setting.AlertType !== 0) {
        NotificationRaise(OnlineNotification.EventType, { body: content, memberNumber: id, characterName: name });
    }
    if (data.chatMsg) ChatRoomLocalAction(content);
}
interface ServerAccountQueryResultItem {
    MemberName: string;
    MemberNumber: number;
    ChatRoomName: string | null;
    ChatRoomSpace: string | null;
    Private?: boolean
    Type: "Submissive" | "Friend" | "Lover";
}

interface ServerAccountQueryResult {
    Result: ServerAccountQueryResultItem[]
}


function CompareNumberArray(cur: ServerAccountQueryResultItem[], prev: ServerAccountQueryResultItem[]) {
    let prevSet = new Set(prev.map(_ => _.MemberNumber));
    let curSet = new Set(cur.map(_ => _.MemberNumber));
    let removed = prev.filter(_ => !curSet.has(_.MemberNumber));
    let added = cur.filter(_ => !prevSet.has(_.MemberNumber));
    return { removed, added };
}

export class OnlineNotification {
    static EventType = 'NotifyPlusFriendOnline';
    static onlineFriendMemory: ServerAccountQueryResultItem[] = [];

    static justLoaded: boolean = true;

    static updateMemory(arg: ServerAccountQueryResult) {
        this.onlineFriendMemory = Array.from(arg.Result);
    }

    static init(mod: ModSDKModAPI, monitor: Monitor) {
        this.justLoaded = true;

        monitor.AddIntervalEvent(20000, (player) => {
            ServerSend("AccountQuery", { Query: "OnlineFriends" });
        })

        mod.hookFunction('DialogFindPlayer', 0, (args, next) => {
            if (args[0] === `NotificationTitle${this.EventType}`) {
                return Localization.GetText('online_notify_popup_title')
            }
            return next(args);
        });

        mod.hookFunction('ServerAccountQueryResult', 0, (args, next) => {
            next(args);
            const arg = args[0] as ServerAccountQueryResult;

            if (this.justLoaded) {
                this.justLoaded = false;
            }
            else {
                const notifySetting = DataManager.instance.data.onlineNotify;
                let { removed, added } = CompareNumberArray(arg.Result, this.onlineFriendMemory);

                removed.forEach(c => {
                    const doNotify = (() => {
                        let specV = notifySetting.notifies.spec.find(_ => _.MemberNumber === c.MemberNumber) as NotifyPlusOnlineSettingSpecV2 | undefined;
                        if (specV) return specV.enableOffline;

                        if (notifySetting.notifies.dom)
                            return Player && Player.IsOwnedByMemberNumber(c.MemberNumber);

                        if (c.Type === 'Lover')
                            return notifySetting.notifies.lover;

                        if (c.Type === 'Friend')
                            return notifySetting.notifies.friend;

                        if (c.Type === 'Submissive')
                            return notifySetting.notifies.sub;

                        return false;
                    })();

                    if (doNotify) raiseOfflineNotify(c.MemberName, c.MemberNumber);
                })

                added.forEach(c => {
                    const doNotify = (() => {
                        let specV = notifySetting.notifies.spec.find(_ => _.MemberNumber === c.MemberNumber) as NotifyPlusOnlineSettingSpecV2 | undefined;
                        if (specV) return specV.enableOnline;

                        if (notifySetting.notifies.dom)
                            return Player && Player.IsOwnedByMemberNumber(c.MemberNumber);

                        if (c.Type === 'Lover')
                            return notifySetting.notifies.lover;

                        if (c.Type === 'Friend')
                            return notifySetting.notifies.friend;

                        if (c.Type === 'Submissive')
                            return notifySetting.notifies.sub;

                        return false;
                    })();

                    if (doNotify) raiseOnlineNotify(c.MemberName, c.MemberNumber);
                })
            }

            this.updateMemory(arg);
        });

        mod.hookFunction('NotificationLoad', 0, (args, next) => {
            next(args);
            NotificationEventHandlerSetup(this.EventType, DataManager.instance.data.onlineNotify.setting);
        });
    }
}