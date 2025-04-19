import { HookManager } from "@sugarch/bc-mod-hook-manager";

export function SetupNotificationHandler(
  EventType: string,
  Setting: () => Promise<NotificationSetting>
) {
  if (Player && Player.MemberNumber) {
    Setting().then((setting) =>
      NotificationEventHandlerSetup(EventType as NotificationEventType, setting)
    );
  } else {
    HookManager.hookFunction("NotificationLoad", 0, (args, next) => {
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
