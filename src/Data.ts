import { ModSDKModAPI } from "bondage-club-mod-sdk";

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
    mergeData: NotifyPlusSolidSetting | undefined;

    static DefaultValue: NotifyPlusSolidSetting = {
        chatNotify: {
            setting: {
                AlertType: 0,
                Audio: 0
            },
            public: ["saki", "saotome", "saki saotome"],
            friend: [],
            lover: ["dear", "treasure"],
            sub: ["master", "mistress"],
            dom: []
        },
        onlineNotify: {
            setting: {
                AlertType: 0,
                Audio: 0
            },
            chatMsg: true,
            notifies: {
                friend: false,
                lover: true,
                sub: true,
                dom: true,
                spec: [],
            }
        }
    };

    private static validateList = (object: any, key: string, itemValidate: (i: any) => boolean) => {
        if (object === undefined || !Array.isArray(object[key])) return [];
        return (object[key] as any[]).filter(_ => itemValidate(_));
    }

    private static Validator = new Map<keyof NotifyPlusSolidSetting, (d: NotifyPlusPartialSetting) => any>([
        ['chatNotify', (d): NotifyPlusSolidSetting['chatNotify'] => {
            if (d.chatNotify === undefined) return DataManager.DefaultValue.chatNotify;
            return {
                setting: {
                    AlertType: d.chatNotify.setting !== undefined && [0, 1, 2, 3].includes(d.chatNotify.setting.AlertType) ? d.chatNotify.setting.AlertType : 0,
                    Audio: d.chatNotify.setting !== undefined && [0, 1, 2].includes(d.chatNotify.setting.Audio) ? d.chatNotify.setting.Audio : 0,
                },
                public: DataManager.validateList(d.chatNotify, "public", _ => typeof _ === 'string'),
                friend: DataManager.validateList(d.chatNotify, "friend", _ => typeof _ === 'string'),
                lover: DataManager.validateList(d.chatNotify, "lover", _ => typeof _ === 'string'),
                dom: DataManager.validateList(d.chatNotify, "dom", _ => typeof _ === 'string'),
                sub: DataManager.validateList(d.chatNotify, "sub", _ => typeof _ === 'string'),
            }
        }],
        ['onlineNotify', (d): NotifyPlusSolidSetting['onlineNotify'] => {
            if (d.onlineNotify === undefined) return DataManager.DefaultValue.onlineNotify;
            return {
                setting: {
                    AlertType: d.onlineNotify.setting !== undefined && [0, 1, 2, 3].includes(d.onlineNotify.setting.AlertType) ? d.onlineNotify.setting.AlertType : 0,
                    Audio: d.onlineNotify.setting !== undefined && [0, 1, 2].includes(d.onlineNotify.setting.Audio) ? d.onlineNotify.setting.Audio : 0,
                },
                chatMsg: typeof d.onlineNotify.chatMsg === 'boolean' ? d.onlineNotify.chatMsg : true,
                notifies: {
                    friend: d.onlineNotify.notifies !== undefined && typeof d.onlineNotify.notifies.friend === 'boolean' ? d.onlineNotify.notifies.friend : DataManager.DefaultValue.onlineNotify.notifies.friend,
                    lover: d.onlineNotify.notifies !== undefined && typeof d.onlineNotify.notifies.lover === 'boolean' ? d.onlineNotify.notifies.lover : DataManager.DefaultValue.onlineNotify.notifies.lover,
                    sub: d.onlineNotify.notifies !== undefined && typeof d.onlineNotify.notifies.sub === 'boolean' ? d.onlineNotify.notifies.sub : DataManager.DefaultValue.onlineNotify.notifies.sub,
                    dom: d.onlineNotify.notifies !== undefined && typeof d.onlineNotify.notifies.dom === 'boolean' ? d.onlineNotify.notifies.dom : DataManager.DefaultValue.onlineNotify.notifies.dom,
                    spec: DataManager.validateList(d.onlineNotify.notifies, "spec", _ => typeof _.MemberNumber === 'number' && typeof _.enable === 'boolean')
                }
            }
        }]
    ])

    private EncodeDataStr() {
        let data: { [k: string]: any } = {}
        for (const k in this.modData) {
            data[k] = this.modData[k as keyof NotifyPlusSolidSetting];
        }
        return LZString.compressToBase64(JSON.stringify(data));
    }

    private DecodeDataStr(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, DataManager.DefaultValue);
            return;
        }

        let d = LZString.decompressFromBase64(str);
        let data = {};

        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        DataManager.Validator.forEach((v, k) => {
            this.modData[k as keyof NotifyPlusSolidSetting] = v(data);
        })
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

