import { CN, TextKey } from "./CN";
import { EN } from "./EN";

export function GetText(srcTag: TextKey, fill: any = {}) {
    let ret = "";
    if (TranslationLanguage === 'CN') {
        ret = CN[srcTag] || srcTag;
    }
    else ret = EN[srcTag] || srcTag;
    for (const k in fill) {
        ret = ret.replace(k, fill[k])
    }

    return ret;
}