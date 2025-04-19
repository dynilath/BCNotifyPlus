import { DataManager } from './Data/Data';
import { GetText } from './i18n';
import { SetupNotificationHandler } from './SetupHelper';
import { HookManager } from '@sugarch/bc-mod-hook-manager';

const raiseNotify = (C: Character, content: string) => {
    const data = DataManager.instance.data.chatNotify;
    if (
        !C.IsPlayer() &&
        data.setting.AlertType !== 0 &&
        !(document.hasFocus() && ElementIsScrolledToEnd('TextAreaChatLog'))
    )
        NotificationRaise(MentionNotification.EventType as NotificationEventType, {
            body: content,
            character: C,
            useCharAsIcon: true,
        });
};

export class MentionNotification {
    static EventType = 'NotifyPlusChatMentioned';
    static CurrentSender: Character | undefined;
    static init () {
        HookManager.hookFunction('InterfaceTextGet', 0, (args, next) => {
            if (args[0] === `NotificationTitle${this.EventType}`) {
                return GetText('chat_notify_popup_title');
            }
            return next(args);
        });

        SetupNotificationHandler(this.EventType, () => Promise.resolve(DataManager.instance.data.chatNotify.setting));
    }

    static handler (data: ServerChatRoomMessage) {
        const { Sender, Content } = data;
        if(!Sender || Sender === Player.MemberNumber) return;

        const senderC = ChatRoomCharacter.find(c=>c.MemberNumber === Sender);
        if(!senderC) return;

        const mentionSetting = DataManager.instance.data.chatNotify;
            const loweredMsg = Content.toLowerCase();

            const criteria = (t: string) => loweredMsg.includes(t) || Content.includes(t);


            const doRaise = (() => {
                if (Player.IsOwnedByMemberNumber(Sender)) {
                    if (mentionSetting.dom.some(criteria)) return true;
                } else if (senderC.IsOwnedByMemberNumber(Player.MemberNumber)) {
                    if (mentionSetting.sub.some(criteria)) return true;
                }

                if (senderC.IsLoverOfMemberNumber(Player.MemberNumber)) {
                    if (mentionSetting.lover.some(criteria)) return true;
                }
                if (Player.FriendList?.includes(Sender)) {
                    if (mentionSetting.friend.some(criteria)) return true;
                }
                if (mentionSetting.public.some(criteria)) return true;
                return false;
            })();

            if (doRaise) raiseNotify(senderC, Content);
    }
}
