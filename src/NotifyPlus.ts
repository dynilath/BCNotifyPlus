import { DataManager } from './Data/Data';
import { GIT_REPO, ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MentionNotification } from './MentionNotification';
import { OnlineNotification } from './OnlineNotification';
import { MainMenu } from './GUI/GUIMainMenu';
import { once } from '@sugarch/bc-mod-utility';
import { HookManager } from '@sugarch/bc-mod-hook-manager';
import { ChatRoomMessageHandlerEvents } from '@sugarch/bc-event-handler';

once(`${ModName}@${ModVersion}`, () => {
    HookManager.init({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });

    DataManager.init(`${ModName} v${ModVersion} ready.`);

    OnlineNotification.init();

    MentionNotification.init();

    ChatRoomMessageHandlerEvents.on('Chat', data => MentionNotification.handler(data));
    ChatRoomMessageHandlerEvents.on('Whisper', data => MentionNotification.handler(data));
    ChatRoomMessageHandlerEvents.on('Emote', data => MentionNotification.handler(data));

    GUISetting.init(() => new MainMenu());
});
