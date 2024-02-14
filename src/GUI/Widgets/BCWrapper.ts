import { GetText } from "../../i18n";
import { AGUIItem } from "./AGUI";
import { WithinRect } from "../IGUI";
import { IPoint } from "../IGUI";
import { IRect } from "../IGUI";

interface BCWrapperEvents {
    before?: () => void;
    after?: () => void;
}

export class BCPreferenceNotifications extends AGUIItem {
    constructor(readonly topLeft: IPoint, readonly text: string, readonly setting: NotifyPlusBasicSetting, readonly EventType: string, readonly events?: BCWrapperEvents) {
        super();
    }

    Draw(hasFocus: boolean): void {
        PreferenceNotificationsDrawSetting(this.topLeft.x, this.topLeft.y, GetText(`chat_notify_notification_setting`), this.setting);
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, { ...this.topLeft, width: 264, height: 64 })) {
            this.events?.before?.();
            PreferenceNotificationsClickSetting(this.topLeft.x, this.topLeft.y, this.setting, this.EventType);
            this.events?.after?.();
        }
    }
}

export class BCCheckbox extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: string, readonly setting: () => boolean, readonly onClick: () => void) {
        super();
    }

    Draw(hasFocus: boolean): void {
        DrawCheckbox(this.rect.x, this.rect.y, this.rect.width, this.rect.height, this.text, this.setting());
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this.rect))
            this.onClick();
    }
}