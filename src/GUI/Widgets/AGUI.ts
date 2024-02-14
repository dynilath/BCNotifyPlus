import { GUISettingScreen, hasFocus, setSubscreen } from "../GUI";
import { IPoint } from "../IGUI";

export abstract class AGUIItem {
    abstract Draw(hasFocus: boolean): void;
    Click(mouse: IPoint): void { };
    MouseWheel(event: WheelEvent): void { };
    Unload(): void { };
}

export class AGUIScreen extends GUISettingScreen {
    protected _prev: GUISettingScreen | null = null;

    protected _items: AGUIItem[] = [];

    constructor(prev: GUISettingScreen | null, items: AGUIItem[] = []) {
        super();
        this._prev = prev;
        this._items = items;
    }

    AddItem(item: AGUIItem) {
        this._items.push(item);
    }

    Run(): void {
        this._items.forEach(item => item.Draw(hasFocus(this)));
    }

    Click(): void {
        this._items.forEach(item => item.Click({ x: MouseX, y: MouseY }));
    }

    MouseWheel(event: WheelEvent): void {
        this._items.forEach(item => item.MouseWheel(event));
    }

    Exit(): void {
        setSubscreen(this._prev);
    }

    Unload(): void {
        this._items.forEach(item => item.Unload());
    }
}


