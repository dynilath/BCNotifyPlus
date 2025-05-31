import { DefaultValue } from "./Default";
import { ValidateSetting } from "./Validate";
import { DataKeyName } from "../Definition";
import { HookManager } from "@sugarch/bc-mod-hook-manager";

function isAcountData(data: ServerLoginResponse): data is ServerAccountData {
    return (data as ServerAccountData).MemberNumber !== undefined;
}

export class DataManager {
    private static _instance: DataManager | undefined;

    static init(msg?: string) {
        if (this._instance === undefined)
            this._instance = new DataManager;

        function LoadAndMessage(C: Pick<PlayerCharacter, 'Name' | 'Nickname' | 'OnlineSettings' | 'ExtensionSettings'>) {
            DataManager.instance.ServerTakeData(C);
            if (msg) console.log(msg);
        }

        HookManager.hookFunction('LoginResponse', 0, (args, next) => {
            const [input] = args;
            // important: must load before original function, for the NotifySetting will be used in the original function
            if (isAcountData(input))
                LoadAndMessage(input as Pick<PlayerCharacter, 'Name' | 'Nickname' | 'OnlineSettings' | 'ExtensionSettings'>);
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

    private DecodeDataStr(str: string | undefined, fallback: ()=> NotifyPlusSolidSetting) {
        if (str === undefined) {
            Object.assign(this.modData, fallback());
            return;
        }

        let d = LZString.decompressFromBase64(str);
        let data = {};

        if (!d) return;
        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        this.modData = ValidateSetting(data, fallback);
    }

    ServerStoreData() {
        if (Player && Player.ExtensionSettings) {
            Player.ExtensionSettings[DataKeyName] = this.EncodeDataStr();
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
    }

    ServerTakeData(C: Pick<PlayerCharacter, 'Name' | 'Nickname' | 'OnlineSettings' | 'ExtensionSettings'>) {
        const setting_data = (()=>{
            if(C.ExtensionSettings && typeof C.ExtensionSettings[DataKeyName] == "string") return C.ExtensionSettings[DataKeyName] as string;
            return undefined; 
        })();
        this.DecodeDataStr(setting_data, () => DefaultValue(C.Nickname || C.Name));
    }

    get data() {
        return this.modData as NotifyPlusSolidSetting;
    }

    set data(d: NotifyPlusSolidSetting) {
        this.modData = d;
    }
}

