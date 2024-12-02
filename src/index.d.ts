interface NotifyPlusBasicSetting {
    AlertType: NotificationAlertType,
    Audio: NotificationAudioType,
}

interface NotifyPlusSpecV1 {
    MemberNumber: number;
    enable: boolean;
}

interface NotifyPlusSpecV2 {
    MemberNumber: number;
    enableOnline: boolean;
    enableOffline: boolean;
}

interface NotifyPlusSpec {
    notifies: {
        friend: boolean;
        lover: boolean;
        sub: boolean;
        dom: boolean;
        spec: (NotifyPlusSpecV1 | NotifyPlusSpecV2)[];
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
    onlineNotify: { setting: NotifyPlusBasicSetting } & { chatMsg: boolean } & NotifyPlusSpec;
}

type NotifyPlusPartialSetting = Partial<NotifyPlusSolidSetting>;

type NotifyPlusModSetting = { BCNotifyPlusSetting?: string }

interface Window {
    __load_flag__?: boolean;
}
declare const __mod_version__: string;
declare const __mod_name__: string;
declare const __repo__: string;