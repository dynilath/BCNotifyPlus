import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DefaultValue } from "./Default";
import { ValidateSetting } from "./Validate";

export class DataManager {
    private static _instance: DataManager | undefined;

    static init(mod: ModSDKModAPI, msg?: string) {
        if (this._instance === undefined)
            this._instance = new DataManager;

        function LoadAndMessage(C: { OnlineSettings: any }) {
            DataManager.instance.ServerTakeData(C);
            if (msg) console.log(msg);
        }

        mod.hookFunction('LoginResponse', 0, (args, next) => {
            LoadAndMessage(args[0]);
            next(args);
        });

        if (Player && Player.MemberNumber) {
            LoadAndMessage(Player as { OnlineSettings: any });
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

        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        this.modData = ValidateSetting(data);
    }

    ServerStoreData() {
        if (Player && Player.OnlineSettings) {
            ((Player.OnlineSettings as any) as NotifyPlusModSetting).BCNotifyPlusSetting = this.EncodeDataStr();
            if (ServerAccountUpdate) {
                ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
            }
        }
    }

    ServerTakeData(C: { OnlineSettings: any }) {
        if (C && C.OnlineSettings) {
            let rawData = ((C.OnlineSettings as any) as NotifyPlusModSetting).BCNotifyPlusSetting;
            this.DecodeDataStr(rawData);
        }
    }

    get data() {
        return this.modData as NotifyPlusSolidSetting;
    }

    set data(d: NotifyPlusSolidSetting) {
        this.modData = d;
    }
}

