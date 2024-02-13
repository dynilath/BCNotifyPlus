function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export const ModVersion = buildVersion(0, 4, 0);
export const ModName = 'Notify Plus'

export const DebugMode = false;

export const CUSTOM_ACTION_TAG = 'NP_CustomAction';

export const DataKeyName = 'BCNotifyPlusSetting';

export const GIT_REPO = 'https://github.com/dynilath/BCNotifyPlus';

export const Styles = {
    Active: "#CCC",
    Hover: "#80FFFF",
    strokeWidth: 2,
    Screen: {
        center_x: 1000,
        center_y: 500,
    },
    Text: {
        Base: "Black",
        Lesser: "#808080",
        padding: 5
    },
    Button: {
        text: "Black",
        hover: "rgba(128, 255, 255, 1)",
        idle: "rgba(255, 255, 255, 1)",
        disabled: "rgba(128, 128, 128, 1)",
    },
}