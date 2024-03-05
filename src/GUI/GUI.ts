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

function drawTooltip() {
    if (DebugMode) {
        MainCanvas.textAlign = "center";
        if (MouseX > 0 || MouseY > 0) {
            MainCanvas.save();
            MainCanvas.lineWidth = 1;
            MainCanvas.strokeStyle = "red";
            MainCanvas.beginPath();
            MainCanvas.moveTo(0, MouseY);
            MainCanvas.lineTo(2000, MouseY);
            MainCanvas.moveTo(MouseX, 0);
            MainCanvas.lineTo(MouseX, 1000);
            MainCanvas.stroke();
            MainCanvas.fillStyle = "black";
            MainCanvas.strokeStyle = "white";
            MainCanvas.fillRect(0, 950, 250, 50);
            MainCanvas.strokeRect(0, 950, 250, 50);
            DrawText(`X: ${MouseX} Y: ${MouseY}`, 125, 975, "white");
            MainCanvas.restore();
        }
    }
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

        if (typeof PreferenceRegisterExtensionSetting === "function") {
            this.registerGUI();
        } else {
            this.hookGUI(mod);
        }
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
                        drawTooltip();
                        MainCanvas.textAlign = origAlign;
                    }
                },
                click: () => this._currentScreen?.Click(),
                unload: () => this._currentScreen?.Unload(),
                exit: () => this._currentScreen?.Exit()
            }
        )
    }

    hookGUI(mod: ModSDKModAPI<any>) {
        mod.hookFunction("PreferenceSubscreenNotificationsRun", 10, (args, next) => {
            if (this._currentScreen) {
                const origAlign = MainCanvas.textAlign;
                this._currentScreen.Run();
                drawTooltip();
                MainCanvas.textAlign = origAlign;
                return;
            }

            next(args);
            DrawButton(1815, 180, 90, 90, "", "White", "Icons/Notifications.png", GetText("notify_plus_setting_button_hint"));
        });

        mod.hookFunction("PreferenceSubscreenNotificationsClick", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Click();
                return;
            }

            if (MouseInRect(EntryButton) && this._mainScreenProvider) {
                this.currentScreen = this._mainScreenProvider();
                return;
            }

            next(args);
        });

        mod.hookFunction("PreferenceSubscreenNotificationsExit", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Exit();
                return;
            }
            return next(args);
        });
    }
}

export abstract class GUISettingScreen {
    Run() { }
    Click() { }
    MouseWheel(event: WheelEvent) { }
    Exit() { setSubscreen(null); }
    Unload() { }
}
