import { ModVersion } from "../../Definition";
import { GetText } from "../../i18n";
import { ADrawText } from "../Common";
import { AGUIItem } from "./AGUI";

export class TitleText extends AGUIItem {
    constructor() { super(); }

    Draw() {
        const text = GetText("notify_plus_setting");
        ADrawText({ x: 201, y: 126 }, `${text} v${ModVersion}`, { color: "Gray" });
        ADrawText({ x: 200, y: 125 }, `${text} v${ModVersion}`);
    }
}