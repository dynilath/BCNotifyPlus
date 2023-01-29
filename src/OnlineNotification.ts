import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { _ } from "core-js";
import { ChatRoomLocalAction } from "./utils/ChatMessages";
import { IsOwnedBy } from "./utils/Criteria";
import { Monitor } from "./utils/Monitor";
import { DataManager } from "./Data";
import { Localization } from "./Lang";

export class OnlineNotification {
    static EventType = 'NotifyPlusFriendOnline';
    static onlineFriendMemory = new Set<number>;

    static justLoaded: boolean = true;

    static init(mod: ModSDKModAPI, monitor: Monitor) {
        this.justLoaded = true;

        const raiseNotify = (name: string, id: number) => {
            const data = DataManager.instance.data.onlineNotify;
            const content = Localization.GetText("notify_friend_online", { CHARANAME: name, CHARANUM: `${id}` });
            if (data.setting.AlertType !== 0) {
                NotificationRaise(OnlineNotification.EventType, { body: content, memberNumber: id, characterName: name });
            }
            if (data.chatMsg) ChatRoomLocalAction(content);
        }

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
            const arg = args[0] as {
                Result: {
                    MemberName: string;
                    MemberNumber: number;
                    ChatRoomName: string | null;
                    ChatRoomSpace: string | null;
                    Private?: boolean
                    Type: "Submissive" | "Friend" | "Lover";
                }[]
            };

            const changed = arg.Result.filter(_ => !this.onlineFriendMemory.has(_.MemberNumber));

            const notifySetting = DataManager.instance.data.onlineNotify;
            if (this.justLoaded) {
                this.justLoaded = false;
            }
            else {
                changed.forEach(c => {
                    if (!Player) return;

                    const doNotify = (() => {
                        let specV = notifySetting.notifies.spec.find(_ => _.MemberNumber === c.MemberNumber);
                        if (specV) return specV.enable;

                        if (Player.Ownership && Player.Ownership.MemberNumber === c.MemberNumber)
                            return notifySetting.notifies.dom;

                        if (c.Type === 'Lover')
                            return notifySetting.notifies.lover;

                        if (c.Type === 'Friend')
                            return notifySetting.notifies.friend;

                        if (c.Type === 'Submissive')
                            return notifySetting.notifies.sub;

                        return false;
                    })();

                    if (doNotify) raiseNotify(c.MemberName, c.MemberNumber);
                })
            }

            this.onlineFriendMemory.clear();
            arg.Result.forEach(_ => this.onlineFriendMemory.add(_.MemberNumber));
        });

        mod.hookFunction('NotificationLoad', 0, (args, next) => {
            next(args);
            NotificationEventHandlerSetup(this.EventType, DataManager.instance.data.onlineNotify.setting);
        });
    }
}