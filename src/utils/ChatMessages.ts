import { CUSTOM_ACTION_TAG } from "../Definition";

export interface ActivityInfo {
    SourceCharacter: { Name: string, MemberNumber: number };
    TargetCharacter: { Name: string, MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
}

export function ActivityDeconstruct(dict: ChatMessageDictionary): ActivityInfo | undefined {
    let SourceCharacter, TargetCharacter, ActivityGroup, ActivityName;
    for (let v of dict) {
        if (v.Tag === 'TargetCharacter' && v.Text && v.MemberNumber)
            TargetCharacter = { Name: v.Text, MemberNumber: v.MemberNumber };
        else if (v.Tag === 'SourceCharacter' && v.Text && v.MemberNumber)
            SourceCharacter = { Name: v.Text, MemberNumber: v.MemberNumber };
        else if (v.FocusGroupName)
            ActivityGroup = v.FocusGroupName;
        else if (v.ActivityName)
            ActivityName = v.ActivityName;
    }
    if (SourceCharacter === undefined || TargetCharacter === undefined
        || ActivityGroup === undefined || ActivityName === undefined) return undefined;
    return { SourceCharacter, TargetCharacter, ActivityGroup, ActivityName };
}


export function ChatRoomChatMessage(msg: string) {
    if (!msg) return;
    ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
}

export function ChatRoomLocalAction(Content: string) {
    if (!Content || !Player || !Player.MemberNumber) return;
    ChatRoomMessage({
        Sender: Player.MemberNumber,
        Content: CUSTOM_ACTION_TAG,
        Type: "Action",
        Dictionary: [
            { Tag: `MISSING PLAYER DIALOG: ${CUSTOM_ACTION_TAG}`, Text: Content },
        ]
    });
}

export function ChatRoomSendAction(Content: string) {
    if (!Content || !Player || !Player.MemberNumber) return;
    ServerSend("ChatRoomChat", {
        Content: CUSTOM_ACTION_TAG,
        Type: "Action",
        Dictionary: [
            { Tag: `MISSING PLAYER DIALOG: ${CUSTOM_ACTION_TAG}`, Text: Content },
        ]
    });
}
