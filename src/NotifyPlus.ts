import bcMod from 'bondage-club-mod-sdk'
import { Monitor } from './utils/Monitor';
import { DataManager } from './Data/Data';
import { GIT_REPO, ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MentionNotification } from './MentionNotification';
import { OnlineNotification } from './OnlineNotification';
import { GUIMainMenu } from './GUI/GUIMainMenu';

(function () {

    window.BCNotifyPlus_Loaded = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });

    const monitor = new Monitor(200);

    OnlineNotification.init(mod, monitor);

    MentionNotification.init(mod);

    GUISetting.init(mod, () => new GUIMainMenu);

    DataManager.init(mod, `${ModName} v${ModVersion} ready.`);

    window.BCNotifyPlus_Loaded = true;
})()