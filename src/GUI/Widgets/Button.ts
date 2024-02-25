import { Styles } from "../../Definition";
import { Icons } from "../Icons";
import { AGUIItem } from "./AGUI";
import { WithinRect as WithinRect } from "../IGUI";
import { IPoint } from "../IGUI";
import { IRect } from "../IGUI";
import { ADrawCircleRect, ADrawFramedRect, ADrawIcon, ADrawRoundRect, ADrawTextButton, ADrawTextFit, BCDrawButton } from "../Common";

export class StdButton extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: string | (() => string), readonly callback: () => void, readonly enabled?: () => boolean) {
        super();
    }

    Draw(hasFocus: boolean) {
        MainCanvas.textAlign = "center";
        ADrawFramedRect(this.rect, (() => {
            if (this.enabled && !this.enabled()) return Styles.Button.disabled;
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this.rect)) return Styles.Button.hover;
            return Styles.Button.idle;
        })());
        if (typeof this.text === "string")
            ADrawTextFit(this.rect, this.text);
        else
            ADrawTextFit(this.rect, this.text());
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this.rect) && (this.enabled === undefined || this.enabled()))
            this.callback();
    }
}

export class DynamicTextRoundButton extends AGUIItem {
    readonly _rect: IRect;
    readonly _text: () => string;
    readonly _callback: () => void;

    enabled: (() => boolean) | undefined;

    constructor(rect: IRect, text: () => string, callback: () => void, enabled?: () => boolean) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
        this.enabled = enabled;
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this._rect)) {
                ADrawCircleRect(this._rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this._rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this._rect, this._text());
        } else {
            ADrawCircleRect(this._rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this._rect, this._text(), { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

export class TextRoundButton extends AGUIItem {
    readonly _rect: IRect;
    readonly _text: string;
    readonly _callback: () => void;

    enabled: (() => boolean) | undefined;

    constructor(rect: IRect, text: string, callback: () => void, enabled?: () => boolean) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
        this.enabled = enabled;
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this._rect)) {
                ADrawCircleRect(this._rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this._rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this._rect, this._text);
        } else {
            ADrawCircleRect(this._rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this._rect, this._text, { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

export class TextButton extends AGUIItem {
    private _rect: IRect;
    private _callback: () => void;
    private _text: string;

    constructor(rect: IRect, text: string, callback: () => void) {
        super();
        this._rect = rect;
        this._text = text;
        this._callback = callback;
    }

    Draw(hasFocus: boolean) {
        ADrawTextButton(this._rect, this._text, hasFocus);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}

export class ExitButton extends AGUIItem {
    private readonly _rect: IRect = {
        x: 1815,
        y: 75,
        width: 90,
        height: 90
    };

    callback: () => void;

    constructor(callback: () => void) {
        super();
        this.callback = callback;
    }

    Draw(hasFocus: boolean) {
        BCDrawButton(this._rect, "", { img: "Icons/Exit.png", disabled: !hasFocus });
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this.callback();
    }
}

export class IconRoundButton extends AGUIItem {
    private _rect: IRect;
    private _radius: number;
    private _icon: keyof typeof Icons;
    private _callback: () => void;
    private _icon_rect: IRect;

    constructor(rect: IRect, radius: number, icon: keyof typeof Icons, callback: () => void) {
        super();
        this._rect = rect;
        this._radius = radius;
        this._icon = icon;
        this._callback = callback;

        const spacing = rect.height * 0.15

        this._icon_rect = {
            x: rect.x + rect.width / 2 - rect.height / 2 + spacing,
            y: rect.y + spacing,
            width: rect.height - spacing * 2,
            height: rect.height - spacing * 2
        }
    }

    Draw(hasFocus: boolean) {
        if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this._rect)) {
            ADrawRoundRect(this._rect, this._radius, { fill: Styles.Button.hover });
        } else {
            ADrawRoundRect(this._rect, this._radius, { fill: Styles.Button.idle });
        }
        ADrawIcon(this._icon_rect, this._icon);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this._callback();
    }
}
