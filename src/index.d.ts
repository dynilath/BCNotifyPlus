interface NotifyPlusBasicSetting {
    AlertType: NotificationAlertType,
    Audio: NotificationAudioType,
}

interface NotifyPlusOnlineSettingSpecV1 {
    MemberNumber: number;
    enable: boolean;
}

interface NotifyPlusOnlineSettingSpecV2 {
    MemberNumber: number;
    enableOnline: boolean;
    enableOffline: boolean;
}

interface NotifyPlusOnlineSetting {
    notifies: {
        friend: boolean;
        lover: boolean;
        sub: boolean;
        dom: boolean;
        spec: (NotifyPlusOnlineSettingSpecV1 | NotifyPlusOnlineSettingSpecV2)[];
    }
}

interface NotifyPlusChatSetting {
    public: string[];
    friend: string[];
    lover: string[];
    sub: string[];
    dom: string[];
}

interface NotifyPlusSolidSetting {
    chatNotify: { setting: NotifyPlusBasicSetting } & NotifyPlusChatSetting;
    onlineNotify: { setting: NotifyPlusBasicSetting } & { chatMsg: boolean } & NotifyPlusOnlineSetting;
}

type NotifyPlusPartialSetting = Partial<NotifyPlusSolidSetting>;

type NotifyPlusModSetting = { BCNotifyPlusSetting?: string }

interface Window {
    BCNotifyPlus_Loaded?: boolean;
    BCNotifyPlus?: (enable: boolean, source: NoifyPlusChatSetting) => void;
}

declare function PreferenceNotificationsDrawSetting(Left: number, Top: number, Text: string, Setting: NotifyPlusBasicSetting);
declare function PreferenceNotificationsClickSetting(Left: number, Top: number, Setting: NotifyPlusBasicSetting, EventType: string);