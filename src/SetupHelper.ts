import { ModSDKModAPI } from "bondage-club-mod-sdk";

export function SetupNotificationHandler(
  mod: ModSDKModAPI,
  EventType: string,
  Setting: () => Promise<NotificationSetting>
) {
  if (Player && Player.MemberNumber) {
    Setting().then((setting) =>
      NotificationEventHandlerSetup(EventType as NotificationEventType, setting)
    );
  } else {
    mod.hookFunction("NotificationLoad", 0, (args, next) => {
      next(args);
      Setting().then((setting) =>
        NotificationEventHandlerSetup(
          EventType as NotificationEventType,
          setting
        )
      );
    });
  }
}
