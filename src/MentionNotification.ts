import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { ChatRoomLocalAction } from "./utils/ChatMessages";
import { IsOwnedBy } from "./utils/Criteria";
import { DataManager } from "./Data";
import { Localization } from "./Lang";

export class MentionNotification {
    static EventType = 'NotifyPlusChatMentioned';
    static CurrentSender: Character | undefined;
    static init(mod: ModSDKModAPI) {

        const raiseNotify = (C: Character, content: string) => {
            const data = DataManager.instance.data.chatNotify;
            if (C.ID !== 0
                && data.setting.AlertType !== 0
                && !(document.hasFocus() && ElementIsScrolledToEnd("TextAreaChatLog")))
                NotificationRaise(MentionNotification.EventType, { body: content });
        }

        mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
            next(args);
            const { Type, Content, Sender } = (args[0] as IChatRoomMessage);
            if (!Player || !Player.MemberNumber || !Player.FriendList) return;
            if (Sender === Player.MemberNumber) return;
            const SenderCharacter = ChatRoomCharacter.find(_ => _.MemberNumber === Sender);
            if (!SenderCharacter) return;
            if (!['Chat', 'Emote'].includes(Type)) return;

            const mentionSetting = DataManager.instance.data.chatNotify;
            let msg = Content.toLowerCase();

            const doRaise = (() => {
                if (IsOwnedBy(Player, SenderCharacter)) {
                    if (mentionSetting.dom.some(_ => msg.includes(_))) return true;
                }
                else if (IsOwnedBy(SenderCharacter, Player)) {
                    if (mentionSetting.sub.some(_ => msg.includes(_))) return true;
                }

                if (SenderCharacter.IsLoverOfMemberNumber(Player.MemberNumber)) {
                    if (mentionSetting.lover.some(_ => msg.includes(_))) return true;
                }
                if (SenderCharacter.FriendList && Player.FriendList.includes(Sender)) {
                    if (mentionSetting.friend.some(_ => msg.includes(_))) return true;
                }
                if (mentionSetting.public.some(_ => msg.includes(_))) return true;
                return false;
            })();

            if (doRaise) raiseNotify(SenderCharacter, Content);
        });

        mod.hookFunction('NotificationLoad', 0, (args, next) => {
            next(args);
            NotificationEventHandlerSetup(this.EventType, DataManager.instance.data.chatNotify.setting);
        });
    }
}