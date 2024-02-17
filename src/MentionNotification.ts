import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "./Data/Data";
import { GetText } from "./i18n";

export class MentionNotification {
    static EventType = 'NotifyPlusChatMentioned';
    static CurrentSender: Character | undefined;
    static init(mod: ModSDKModAPI) {

        const raiseNotify = (C: Character, content: string) => {
            const data = DataManager.instance.data.chatNotify;
            if (!C.IsPlayer()
                && data.setting.AlertType !== 0
                && !(document.hasFocus() && ElementIsScrolledToEnd("TextAreaChatLog")))
                NotificationRaise(MentionNotification.EventType, {
                    body: content, character: C, useCharAsIcon: true
                });
        }

        mod.hookFunction('DialogFindPlayer', 0, (args, next) => {
            if (args[0] === `NotificationTitle${this.EventType}`) {
                return GetText('chat_notify_popup_title')
            }
            return next(args);
        });

        mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
            next(args);
            const { Type, Content, Sender } = (args[0] as ServerChatRoomMessage);
            if (!Player || !Player.MemberNumber || !Player.FriendList) return;
            if (Sender === Player.MemberNumber) return;
            const SenderCharacter = ChatRoomCharacter.find(_ => _.MemberNumber === Sender);
            if (!SenderCharacter) return;
            if (!['Chat', 'Emote'].includes(Type)) return;

            const mentionSetting = DataManager.instance.data.chatNotify;
            let msg = Content.toLowerCase();

            const doRaise = (() => {
                if (Player.IsOwnedByMemberNumber(Sender)) {
                    if (mentionSetting.dom.some(_ => msg.includes(_))) return true;
                } else if (SenderCharacter.IsOwnedByMemberNumber(Player.MemberNumber)) {
                    if (mentionSetting.sub.some(_ => msg.includes(_))) return true;
                }

                if (SenderCharacter.IsLoverOfMemberNumber(Player.MemberNumber)) {
                    if (mentionSetting.lover.some(_ => msg.includes(_))) return true;
                }
                if (Player.FriendList?.includes(Sender)) {
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