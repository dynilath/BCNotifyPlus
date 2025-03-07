import bcMod from 'bondage-club-mod-sdk'
import { ChatRoomHandler } from 'bc-utilities';
import { DataManager } from './Data/Data';
import { CUSTOM_ACTION_TAG, GIT_REPO, ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MentionNotification } from './MentionNotification';
import { OnlineNotification } from './OnlineNotification';
import { MainMenu } from './GUI/GUIMainMenu';
import { ChatRoomAction } from 'bc-utilities';

(function () {

    window.__load_flag__ = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });
    
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    DataManager.init(mod, `${ModName} v${ModVersion} ready.`);

    OnlineNotification.init(mod);

    MentionNotification.init(mod);

    ChatRoomHandler.init(mod).then(MentionNotification.handler);

    GUISetting.init(mod, () => new MainMenu());

    window.__load_flag__ = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()