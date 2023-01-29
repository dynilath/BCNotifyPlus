export interface ActivityInfo {
    SourceCharacter: { Name: string, MemberNumber: number };
    TargetCharacter: { Name: string, MemberNumber: number };
    ActivityGroup: string;
    ActivityName: string;
}

interface AnalBead2Action {
    DestinationCharacter: { Name: string, MemberNumber: number };
    SourceCharacter: { Name: string, MemberNumber: number };
    ActivityName: string;
    ActivityGroup: string;
    AssetName: string;
    AssetGroupName: string;
    ActivityCounter: number;
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


export interface ActionActivityInfo {
    SourceCharacter: { Name: string, MemberNumber: number };
    DestinationCharacter: { Name: string, MemberNumber: number };
    Asset: string;
    FocusAssetGroup: string;
}

export function AnalBead2Action(data: IChatRoomMessage, self: Character): { type: "Add" | "Sub", count: number } | undefined {
    const contentSub = ['AnalBeads2SetMin', 'AnalBeads2SetDown']
    const cotentAdd = ['AnalBeads2SetMax', 'AnalBeads2SetUpTo2', 'AnalBeads2SetUpTo3', 'AnalBeads2SetUpTo4', 'AnalBeads2SetUpTo5']
    if (data.Type !== 'Action') return;
    let nTag = data.Dictionary?.find(_ => _.ActivityCounter !== undefined);
    let DestinationCharacter = data.Dictionary?.find(_ => _.Tag && _.Tag === 'DestinationCharacter');
    if (nTag === undefined || DestinationCharacter === undefined) return;

    if (!DestinationCharacter.MemberNumber || DestinationCharacter.MemberNumber !== self.MemberNumber) return;

    if (contentSub.includes(data.Content)) {
        return { type: "Sub", count: nTag.ActivityCounter };
    }
    else if (cotentAdd.includes(data.Content)) {
        return { type: "Add", count: nTag.ActivityCounter };
    }
    return;
}

export function ChatRoomChatMessage(msg: string) {
    if (!msg) return;
    ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
}

export function ChatRoomLocalAction(Content: string) {
    if (!Content || !Player || !Player.MemberNumber) return;
    ChatRoomMessage({
        Sender: Player.MemberNumber,
        Content: "Beep",
        Type: "Action",
        Dictionary: [
            { Tag: "Beep", Text: "msg" },
            { Tag: "Biep", Text: "msg" },
            { Tag: "Sonner", Text: "msg" },
            { Tag: "发送私聊", Text: "msg" },
            { Tag: "msg", Text: Content }
        ]
    });
}

export function ChatRoomSendAction(Content: string) {
    if (!Content || !Player || !Player.MemberNumber) return;
    ServerSend("ChatRoomChat", {
        Content: "Beep",
        Type: "Action",
        Dictionary: [
            { Tag: "Beep", Text: "msg" },
            { Tag: "Biep", Text: "msg" },
            { Tag: "Sonner", Text: "msg" },
            { Tag: "发送私聊", Text: "msg" },
            { Tag: "msg", Text: Content }
        ]
    });
}
