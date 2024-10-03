import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DefaultValue } from "./Default";
import { ValidateSetting } from "./Validate";
import { DataKeyName } from "../Definition";

export class DataManager {
    private static _instance: DataManager | undefined;

    static init(mod: ModSDKModAPI, msg?: string) {
        if (this._instance === undefined)
            this._instance = new DataManager;

        function LoadAndMessage(C: Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>) {
            DataManager.instance.ServerTakeData(C);
            if (msg) console.log(msg);
        }

        mod.hookFunction('LoginResponse', 0, (args, next) => {
            if (typeof args[0] !== 'object') return;
            LoadAndMessage(args[0] as Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>);
            next(args);
        });

        if (Player && Player.MemberNumber) {
            LoadAndMessage(Player);
        }
    }

    static get instance() {
        return DataManager._instance as DataManager;
    }

    modData: NotifyPlusPartialSetting = {};

    private EncodeDataStr() {
        let data: { [k: string]: any } = {}
        for (const k in this.modData) {
            data[k] = this.modData[k as keyof NotifyPlusSolidSetting];
        }
        return LZString.compressToBase64(JSON.stringify(data));
    }

    private DecodeDataStr(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, DefaultValue());
            return;
        }

        let d = LZString.decompressFromBase64(str);
        let data = {};

        if (!d) return;
        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        this.modData = ValidateSetting(data);
    }

    ServerStoreData() {
        if (Player && Player.ExtensionSettings) {
            Player.ExtensionSettings[DataKeyName] = this.EncodeDataStr();
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
    }

    ServerTakeData(C: Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>) {
        const setting_data = C.ExtensionSettings[DataKeyName] || (C.OnlineSettings as any)[DataKeyName];
        this.DecodeDataStr(setting_data);
    }

    get data() {
        return this.modData as NotifyPlusSolidSetting;
    }

    set data(d: NotifyPlusSolidSetting) {
        this.modData = d;
    }
}

