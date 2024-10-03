import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DebugMode, ModName } from "../Definition";
import { GetText } from "../i18n";
import { MouseInRect } from "./IGUI";
import { IRect } from "./IGUI";

export function getCurrentSubscreen(): GUISettingScreen | null {
    return GUISetting.instance && GUISetting.instance.currentScreen;
}

export function setSubscreen(subscreen: GUISettingScreen | null): void {
    if (GUISetting.instance) {
        GUISetting.instance.currentScreen = subscreen;
        if (!GUISetting.instance.currentScreen) {
            if (typeof PreferenceSubscreenExtensionsClear === "function")
                PreferenceSubscreenExtensionsClear();
        }
    }
}

export function hasFocus(subscreen: GUISettingScreen): boolean {
    return getCurrentSubscreen() === subscreen;
}


const EntryButton: IRect = { x: 1815, y: 180, width: 90, height: 90 };

export class GUISetting {
    static instance: GUISetting | null = null;

    private _currentScreen: GUISettingScreen | null = null;

    private _mainScreenProvider: (() => GUISettingScreen) | null = null;

    get currentScreen(): GUISettingScreen | null {
        return this._currentScreen;
    }

    set currentScreen(subscreen: GUISettingScreen | null) {
        if (this._currentScreen) {
            this._currentScreen.Unload();
        }
        this._currentScreen = subscreen;
    }

    static init(mod: ModSDKModAPI, func: () => GUISettingScreen) {
        GUISetting.instance = new GUISetting(mod, func);
    }

    constructor(mod: ModSDKModAPI, func: () => GUISettingScreen) {
        this._mainScreenProvider = func;
        this.registerGUI();
    }

    registerGUI() {
        PreferenceRegisterExtensionSetting(
            {
                Identifier: ModName,
                Image: "Icons/Notifications.png",
                ButtonText: () => GetText("notify_plus_setting_button_hint"),
                load: () => {
                    if (this._mainScreenProvider)
                        this.currentScreen = this._mainScreenProvider();
                },
                run: () => {
                    if (this._currentScreen) {
                        const origAlign = MainCanvas.textAlign;
                        this._currentScreen.Run();
                        MainCanvas.textAlign = origAlign;
                    }
                },
                click: () => this._currentScreen?.Click(),
                unload: () => this._currentScreen?.Unload(),
                exit: () => this._currentScreen?.Exit()
            }
        )
    }
}

export abstract class GUISettingScreen {
    Run() { }
    Click() { }
    MouseWheel(event: WheelEvent) { }
    Exit() { setSubscreen(null); }
    Unload() { }
}
