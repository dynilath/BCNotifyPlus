import { DefaultValue } from "./Default";

function PickStringInArray(d: any): string[] {
    if (!Array.isArray(d)) return [];
    return d.filter(_ => typeof _ === 'string');
}

function PickNotifySetting(d: any): NotifyPlusBasicSetting {
    let data: NotifyPlusBasicSetting = {
        AlertType: 0,
        Audio: 0
    };
    if (d === undefined) return data;
    if (d.setting !== undefined) {
        if (d.setting.AlertType !== undefined && [0, 1, 2, 3].includes(d.setting.AlertType)) {
            data.AlertType = d.setting.AlertType;
        }
        if (d.setting.Audio !== undefined && [0, 1, 2].includes(d.setting.Audio)) {
            data.Audio = d.setting.Audio;
        }
    }
    return data;
}

function PickBoolean(d: any, def: boolean): boolean {
    if (typeof d === 'boolean') return d;
    return def;
}

function IsV1Spec(d: any): d is NotifyPlusSpecV1 {
    return d !== undefined && typeof d.MemberNumber === 'number' && typeof d.enable === 'boolean';
}

function IsV2Spec(d: any): d is NotifyPlusSpecV2 {
    return d !== undefined && typeof d.MemberNumber === 'number' && typeof d.enableOnline === 'boolean' && typeof d.enableOffline === 'boolean';
}

export function ValidateSetting(d: any): NotifyPlusSolidSetting {
    let data = DefaultValue();
    if (d === undefined) return data;
    if (d.chatNotify !== undefined) {
        data.chatNotify.setting = PickNotifySetting(d.chatNotify);
        (['public', 'friend', 'lover', 'sub', 'dom'] as (keyof NotifyPlusChatSetting)[]).forEach((_) => {
            data.chatNotify[_] = PickStringInArray(d.chatNotify[_]);
        });
    }

    if (d.onlineNotify !== undefined) {
        data.onlineNotify.setting = PickNotifySetting(d.onlineNotify);

        data.onlineNotify.chatMsg = PickBoolean(d.onlineNotify.chatMsg, data.onlineNotify.chatMsg);

        if (d.onlineNotify.notifies !== undefined) {
            (['friend', 'lover', 'sub', 'dom'] as (keyof NotifyPlusSpec['notifies'])[]).forEach((_) => {
                (data.onlineNotify.notifies[_] as boolean) = PickBoolean(d.onlineNotify.notifies[_], data.onlineNotify.notifies[_] as boolean);
            });

            if (Array.isArray(d.onlineNotify.notifies.spec)) {
                data.onlineNotify.notifies.spec = d.onlineNotify.notifies.spec.map((_: any) => {
                    if (IsV2Spec(_)) return _;
                    if (IsV1Spec(_)) return { MemberNumber: _.MemberNumber, enableOnline: _.enable, enableOffline: _.enable };
                    return undefined;
                }).filter((_: any) => _ !== undefined) as NotifyPlusSpecV2[];
            }
        }
    }
    return data;
}