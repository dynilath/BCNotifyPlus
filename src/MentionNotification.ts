import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "./Data/Data";
import { GetText } from "./i18n";
import { ChatRoomHandler } from "bc-utilities";
import { SetupNotificationHandler } from "./SetupHelper";

const raiseNotify = (C: Character, content: string) => {
  const data = DataManager.instance.data.chatNotify;
  if (
    !C.IsPlayer() &&
    data.setting.AlertType !== 0 &&
    !(document.hasFocus() && ElementIsScrolledToEnd("TextAreaChatLog"))
  )
    NotificationRaise(MentionNotification.EventType as NotificationEventType, {
      body: content,
      character: C,
      useCharAsIcon: true,
    });
};

export class MentionNotification {
  static EventType = "NotifyPlusChatMentioned";
  static CurrentSender: Character | undefined;
  static init(mod: ModSDKModAPI) {
    mod.hookFunction("DialogFindPlayer", 0, (args, next) => {
      if (args[0] === `NotificationTitle${this.EventType}`) {
        return GetText("chat_notify_popup_title");
      }
      return next(args);
    });

    SetupNotificationHandler(mod, this.EventType, () =>
      Promise.resolve(DataManager.instance.data.chatNotify.setting)
    );
  }

  static handler(handler: ChatRoomHandler) {
    handler.onReceiveChatWhisperEmote((player, sender, msgSrc, type) => {
      const mentionSetting = DataManager.instance.data.chatNotify;
      const msg = msgSrc.toLowerCase();

      const senderNumber = sender.MemberNumber;
      const playerNumber = player.MemberNumber;
      if (!playerNumber || !senderNumber) return;

      const doRaise = (() => {
        if (player.IsOwnedByMemberNumber(senderNumber)) {
          if (mentionSetting.dom.some((_) => msg.includes(_))) return true;
        } else if (sender.IsOwnedByMemberNumber(playerNumber)) {
          if (mentionSetting.sub.some((_) => msg.includes(_))) return true;
        }

        if (sender.IsLoverOfMemberNumber(playerNumber)) {
          if (mentionSetting.lover.some((_) => msg.includes(_))) return true;
        }
        if (player.FriendList?.includes(senderNumber)) {
          if (mentionSetting.friend.some((_) => msg.includes(_))) return true;
        }
        if (mentionSetting.public.some((_) => msg.includes(_))) return true;
        return false;
      })();

      if (doRaise) raiseNotify(sender, msgSrc);
    });
  }
}