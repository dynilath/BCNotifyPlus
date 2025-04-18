import { DataManager } from './Data/Data';
import { GetText } from './i18n';
import { SetupNotificationHandler } from './SetupHelper';
import { HookManager } from '@sugarch/bc-mod-hook-manager';
import { messager } from './messager';

function raiseOnlineNotify (name: string, id: number) {
    const data = DataManager.instance.data.onlineNotify;
    const content = GetText('notify_friend_online', {
        CHARANAME: name,
        CHARANUM: `${id}`,
    });
    if (data.setting.AlertType !== 0) {
        NotificationRaise(OnlineNotification.EventType as NotificationEventType, {
            body: content,
            memberNumber: id,
            characterName: name,
        });
    }
    if (data.chatMsg) messager.localAction(content);
}

function raiseOfflineNotify (name: string, id: number) {
    const data = DataManager.instance.data.onlineNotify;
    const content = GetText('notify_friend_offline', {
        CHARANAME: name,
        CHARANUM: `${id}`,
    });
    if (data.setting.AlertType !== 0) {
        NotificationRaise(OnlineNotification.EventType as NotificationEventType, {
            body: content,
            memberNumber: id,
            characterName: name,
        });
    }
    if (data.chatMsg) messager.localAction(content);
}
interface ServerAccountQueryResultItem {
    MemberName: string;
    MemberNumber: number;
    ChatRoomName: string | null;
    ChatRoomSpace: string | null;
    Private?: boolean;
    Type: 'Submissive' | 'Friend' | 'Lover';
}

interface ServerAccountQueryResult {
    Result: ServerAccountQueryResultItem[];
}

function CompareNumberArray (cur: ServerAccountQueryResultItem[], prev: ServerAccountQueryResultItem[]) {
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

    static updateMemory (arg: ServerAccountQueryResult) {
        this.onlineFriendMemory = Array.from(arg.Result);
    }

    static init () {
        this.justLoaded = true;

        setInterval(() => {
            ServerSend('AccountQuery', { Query: 'OnlineFriends' });
        }, 20000);

        HookManager.hookFunction('InterfaceTextGet', 0, (args, next) => {
            if (args[0] === `NotificationTitle${this.EventType}`) {
                return GetText('online_notify_popup_title');
            }
            return next(args);
        });

        HookManager.hookFunction('ServerAccountQueryResult', 0, (args, next) => {
            next(args);
            const arg = args[0] as ServerAccountQueryResult;

            if (this.justLoaded) {
                this.justLoaded = false;
            } else {
                const notifySetting = DataManager.instance.data.onlineNotify;
                let { removed, added } = CompareNumberArray(arg.Result, this.onlineFriendMemory);

                removed.forEach(c => {
                    const doNotify = (() => {
                        let specV = notifySetting.notifies.spec.find(_ => _.MemberNumber === c.MemberNumber) as
                            | NotifyPlusSpecV2
                            | undefined;
                        if (specV) return specV.enableOffline;

                        if (notifySetting.notifies.dom) return Player && Player.IsOwnedByMemberNumber(c.MemberNumber);

                        if (c.Type === 'Lover') return notifySetting.notifies.lover;

                        if (c.Type === 'Friend') return notifySetting.notifies.friend;

                        if (c.Type === 'Submissive') return notifySetting.notifies.sub;

                        return false;
                    })();

                    if (doNotify) raiseOfflineNotify(c.MemberName, c.MemberNumber);
                });

                added.forEach(c => {
                    const doNotify = (() => {
                        let specV = notifySetting.notifies.spec.find(_ => _.MemberNumber === c.MemberNumber) as
                            | NotifyPlusSpecV2
                            | undefined;
                        if (specV) return specV.enableOnline;

                        if (notifySetting.notifies.dom) return Player && Player.IsOwnedByMemberNumber(c.MemberNumber);

                        if (c.Type === 'Lover') return notifySetting.notifies.lover;

                        if (c.Type === 'Friend') return notifySetting.notifies.friend;

                        if (c.Type === 'Submissive') return notifySetting.notifies.sub;

                        return false;
                    })();

                    if (doNotify) raiseOnlineNotify(c.MemberName, c.MemberNumber);
                });
            }

            this.updateMemory(arg);
        });

        SetupNotificationHandler(this.EventType, () =>
            Promise.resolve(DataManager.instance.data.onlineNotify.setting)
        );
    }
}
