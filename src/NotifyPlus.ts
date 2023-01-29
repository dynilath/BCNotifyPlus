import bcMod from 'bondage-club-mod-sdk'
import { Monitor } from './utils/Monitor';
import { DataManager } from './Data';
import { ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MentionNotification } from './MentionNotification';
import { OnlineNotification } from './OnlineNotification';

(function () {

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion });

    window.BCNotifyPlus = function (enable: boolean, src: NotifyPlusChatSetting) {
    }

    const monitor = new Monitor(200);

    OnlineNotification.init(mod, monitor);

    MentionNotification.init(mod);

    const GUI = new GUISetting;
    GUI.load(mod);

    DataManager.init(mod, `${ModName} v${ModVersion} ready.`);

    window.BCNotifyPlus_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()