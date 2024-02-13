import { CN } from "./CN";
import { EN } from "./EN";

export function GetText(srcTag: string, fill: any = {}) {
    let ret = "";
    if (TranslationLanguage === 'CN') {
        ret = CN.get(srcTag) || srcTag;
    }
    else ret = EN.get(srcTag) || srcTag;

    for (const k in fill) {
        ret = ret.replace(k, fill[k])
    }

    return ret;
}