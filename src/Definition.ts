function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export const ModVersion = buildVersion(0, 3, 1);
export const ModName = 'Notify Plus'

export const DebugMode = false;

export const CUSTOM_ACTION_TAG = 'NP_CustomAction';