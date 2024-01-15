declare var TranslationLanguage: string;
declare var CurrentScreen: string;
declare var ChatRoomSpace: string | null;

interface ChatRoomChatLogItem {
    Chat: string;
    Garbled: string;
    Original: string;
    SenderName: string;
    SenderMemberNumber: number;
    Time: number;
}

declare var ChatRoomChatLog: ChatRoomChatLogItem[] | undefined | null;

interface Character {
    ID: number;
    Appearance: Item[];
    AllowItem: boolean;
    AssetFamily: string;
    MemberNumber?: number;
    GhostList?: number[];
    BlackList?: number[];
    FriendList?: number[];
    Name: string;
    Nickname: string;
    ActivePose: string[] | null;
    Effect: string[];
    Money?: number;
    Skill?: { Type: string, Level: number, Progress: number, Ratio?: number }[];
    FriendNames?: Map<number, string>;
    CanInteract: () => boolean;
    CanWalk: () => boolean;
    CanTalk: () => boolean;
    CanChangeToPose: (string) => boolean;
    IsOwnedByMemberNumber: (id: number) => boolean;
    IsLoverOfMemberNumber: (id: number) => boolean;
    FocusGroup: AssetGroup | null;
    Ownership?: {
        MemberNumber?: number,
        Name: string,
        Start: number,
        Stage: number,
    },
    Lovership?: {
        MemberNumber: number,
        Name: string,
        Start: number,
        Stage: number,
    }[],
    OnlineSharedSettings: {
        AllowFullWardrobeAccess: boolean,
        BlockBodyCosplay: boolean,
        AllowPlayerLeashing: boolean,
        DisablePickingLocksOnSelf: boolean,
        GameVersion: string,
        ItemsAffectExpressions: boolean,
    };
    OnlineSettings?: {
        AutoBanBlackList: boolean;
        AutoBanGhostList: boolean;
        DisableAnimations: boolean;
        SearchShowsFullRooms: boolean;
        SearchFriendsFirst: boolean;
        SendStatus?: boolean;
        ShowStatus?: boolean;
        EnableAfkTimer: boolean;
    };
    ExtensionSettings: {
        [k: string]: any;
    };
    ImmersionSettings?: {
        BlockGaggedOOC: boolean;
        StimulationEvents: boolean;
        ReturnToChatRoom: boolean;
        ReturnToChatRoomAdmin: boolean;
        SenseDepMessages: boolean;
        ChatRoomMuffle: boolean;
        BlindAdjacent: boolean;
        AllowTints: boolean;
    };
    ArousalSettings: {
        Active: string;
        Visible: string;
        ShowOtherMeter: boolean;
        AffectExpression: boolean;
        AffectStutter: string;
        VFX: string;
        VFXVibrator: string;
        VFXFilter: string;
        Progress: number;
        ProgressTimer: number;
        VibratorLevel: number;
        ChangeTime: number;
        OrgasmTimer?: number;
        OrgasmStage?: number;
        OrgasmCount?: number;
        DisableAdvancedVibes: boolean;
        Activity: { Name: string, Self: number, Other: number }[],
        Zone: { Name: string, Factor: number, Orgasm?: boolean }[],
    };
    Reputation?: { Type: string, Value: number }[];
}

type Color = string | string[];

declare const LZString: import("lz-string").LZStringStatic;

interface AssetGroup {
    Family: string,
    Name: string,
    Description: string,
    BodyCosplay: boolean
}

interface Asset {
    Name: string;
    Description: string;
    Category?: string;
    Group: AssetGroup;
}

interface ItemProperty {
    AllowActivity?: string[];
    Attribute?: string[];
    Block?: string[];
    Difficulty?: number;
    Effect?: string[];
    Hide?: string[];
    HideItem?: string[];
    Type?: string | null;
    Expression?: string | null;
    InsertedBeads?: number;
    OverrideAssetEffect?: boolean;
    LockedBy?: string;
    LockMemberNumber?: number;
    Mode?: string;
    SetPose?: string[];
    FreezeActivePose?: string[];
    SelfUnlock?: boolean;
    AutoPunish?: number;
    AutoPunishUndoTime?: number;
    AutoPunishUndoTimeSetting?: number;
    OriginalSetting?: string;
    ChatMessage?: boolean;
    BlinkState?: 0;
    Text?: string;
    BlockRemotes?: boolean;
    OpenPermission?: boolean;
    OpenPermissionArm?: boolean;
    OpenPermissionChastity?: boolean;
    OpenPermissionLeg?: boolean;
    Intensity?: number;
}

interface Item {
    Asset: Asset;
    Color: Color;
    Craft?: {
        Item: string,
        Property: string,
        Lock: string,
        Color: string,
        Name: string,
        Description: string,
        MemberName: string,
        MemberNumber: number,
        OverridePriority: null | number,
        Private: boolean,
    };
    Difficulty?: number;
    Property?: ItemProperty;
}

declare var Player: Character | undefined;
declare var ChatRoomCharacter: Character[];

declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

declare function LoginMaidItems(): void;
declare function LoginMaidItems(): void;

declare function InventoryIsWorn(C: Character, AssetName: string, AssetGroup: string): boolean;
declare function InventoryLock(C: Character, Item: Item, Lock: string, MemberNumber: number, Update: boolean = true)
declare function InventoryShockExpression(C: Character): void;

declare function ServerSend(Message: string, Data: any): void;
declare function CommonTime(): number;
declare function ChatRoomSendLocal(Content: string, Timeout?: number): void;
declare function InventoryGet(Character: Character, BodyPart: String): Item | null;
declare function SpeechGetTotalGagLevel(C: Character, NoDeaf?: boolean): number;

declare function LogQuery(QueryLogName: string, QueryLogGroup: string): boolean;
declare function LogAdd(NewLogName: string, NewLogGroup: string, NewLogValue?: number, Push?: boolean): void;

type MessageActionType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" |
    "LocalMessage" | "ServerMessage" | "Status";

declare function CharacterAppearanceSetColorForGroup(Character: Character, Color: Color, BodyPart: String): void;
declare function CharacterItemsHavePoseAvailable(C: Character, Type: string | undefined, Pose: string): boolean;
declare function CharacterCanChangeToPose(C: Character, poseName: string): boolean;
declare function CharacterRefresh(C: Character, Push?: boolean, RefreshDialog?: boolean): void;
declare function CharacterNickname(C: Character): string;
declare function CharacterLoadCanvas(C: Character): void;
declare function CharacterChangeMoney(C: Character, Value: number): void;
declare function CharacterSetActivePose(C: Character, NewPose: string): void;
declare function ServerPlayerExtensionSettingsSync(dataKeyName: string): void;

declare function ServerPlayerAppearanceSync(): void;
declare function ServerPlayerInventorySync(): void;
declare function ServerPlayerReputationSync(): void;
declare function ServerPlayerSync(): void;
declare function ServerPlayerSkillSync(): void;

declare function ChatRoomCharacterItemUpdate(Character: Character, Group: string): void;
declare function ChatRoomCharacterUpdate(Character: Character): void;
declare function AssetGet(Family: string, Group: string, Name: string): Asset | null;
declare function AssetGroupGet(Family: string, Group: string): AssetGroup | null;

interface Activity {
    Name: string;
    MaxProgress: number;
    Prerequisite: string[];
    Target: string[];
}

declare function AssetAllActivities(family: string): Activity[];
declare function ActivityAllowedForGroup(character: Character, groupname: string, allowItem: boolean = false): Activity[];

declare var KeyPress: number;
declare var MiniGameCheatAvailable: boolean;

declare var MainCanvas: CanvasRenderingContext2D;

declare var ServerAccountUpdate: {
    SyncToServer(): void;
    QueueData(Data: object, Force?: true): void
};

declare var MagicPuzzleStarted: boolean;
declare var MiniGameEnded: boolean;
declare var MiniGameVictory: boolean;
declare var MagicPuzzleFinish: number;
declare var ActivityOrgasmRuined: boolean;

type MessageContentType = string;

type CommonChatTags =
    | "SourceCharacter"
    | "DestinationCharacter"
    | "DestinationCharacterName"
    | "TargetCharacter"
    | "TargetCharacterName"
    | "AssetName";

interface ChatMessageDictionaryEntry {
    [k: string]: any;
    Tag?: CommonChatTags | string;
    Text?: string;
    MemberNumber?: number;
}

type ChatMessageDictionary = ChatMessageDictionaryEntry[];

interface IChatRoomMessageBasic {
    Content: MessageContentType;
    Sender: number;
}

type MessageActionType = "Action" | "Chat" | "Whisper" | "Emote" | "Activity" | "Hidden" | "LocalMessage" | "ServerMessage" | "Status";

interface IChatRoomMessage extends IChatRoomMessageBasic {
    Type: MessageActionType;
    Dictionary?: ChatMessageDictionary;
    Timeout?: number;
}

declare function ChatRoomMessage(data: IChatRoomMessage): void;
declare function ChatRoomPublishCustomAction(msg: string, LeaveDialog: boolean, Dictionary: ChatMessageDictionary)

declare function PreferenceIsPlayerInSensDep(bypassblindness?: boolean): boolean;
declare var InformationSheetPreviousModule: string;
declare var InformationSheetPreviousScreen: string;

declare function ChatRoomSendChat(): void;
declare var ChatRoomMenuButtons: string[];
declare function ElementValue(id: string, value?: string): string;

//text.js
declare function TextGet(key: string): string;

//Common.js
declare function CommonSetScreen(Module: string, Screen: string): void;

//Female3DCG.js
interface Pose {
    Name: string;
    Category?: 'BodyUpper' | 'BodyLower' | 'BodyFull';
    AllowMenu?: true;
    OverrideHeight?: AssetOverrideHeight;
    Hide?: string[];
    MovePosition?: { Group: string; X: number; Y: number; }[];
}
declare var PoseFemale3DCG: Pose[];


declare var AssetFemale3DCG: ({ Priority: number; Category?: 'Appearance' | 'Item'; Group: string; Clothing: boolean; BodyCosplay?: boolean; })[]
declare var AssetFemale3DCGExtended: ({ [k: string]: { [k: string]: any } });
type ExtendedArchetype = 'modular' | 'typed' | 'vibrating' | 'variableheight';

declare function InventoryAdd(C: Character, item: string, group: string, Push?: boolean = true);

// Cafe.js
declare var CafeIsHeadMaid: boolean;

// MaidQuarters.js
declare var MaidQuartersItemClothPrev: any;

//suitcase
declare var KidnapLeagueOnlineBountyTarget: number;
declare var KidnapLeagueOnlineBountyTargetStartedTime: number;

//ChatRoom.js
declare var ChatRoomTargetMemberNumber: number | null;
declare var ChatRoomSlowStop: boolean;
declare function ChatRoomMessageMentionsCharacter(C: Character, msg: string): boolean;
declare function ChatRoomNotificationRaiseChatMessage(C: Character, msg: string): void;
declare function ChatRoomHTMLEntities(msg: string): string;

//Speech.js
declare function SpeechGarble(C: Character, CD: string, NoDeaf?: boolean): string;

//Reputation.js
declare function ReputationGet(RepType: string): number;
declare function ReputationProgress(RepType: string, Value: number): void;

//Draw.js
declare var MouseX: number;
declare var MouseY: number;
declare var MainCanvas: CanvasRenderingContext2D;
declare function DrawGetImage(Source: string): HTMLImageElement;
declare function DrawButton(Left: number, Top: number, Width: number, Height: number, Label: string, Color: string, Image?: string, HoveringText?: string, Disabled?: boolean): void;
declare function DrawCheckbox(Left: number, Top: number, Width: number, Height: number, Text: string, IsChecked: boolean, Disabled?: boolean, TextColor?: string, CheckImage?: string): void;
declare function DrawText(Text: string, X: number, Y: number, Color: string, BackColor?: string): void;
declare function DrawTextFit(Text: string, X: number, Y: number, Width: number, Color: string, BackColor?: string): void;
declare function DrawTextWrap(Text: string, X: number, Y: number, Width: number, Height: number, ForeColor: string, BackColor?: string, MaxLine?: number): void;
declare function DrawBackNextButton(Left: number, Top: number, Width: number, Height: number, Label: string, Color: string, Image?: string, BackText?: () => string, NextText?: () => string, Disabled?: boolean, ArrowWidth?: number): void;
declare function DrawButtonHover(Left: number, Top: number, Width: number, Height: number, HoveringText: string): void;
declare function DrawEmptyRect(Left: number, Top: number, Width: number, Height: number, Color: string, Thickness?: number): void;
declare function DrawRect(Left: number, Top: number, Width: number, Height: number, Color: string): void;
declare function DrawCharacter(C: Character, X: number, Y: number, Zoom: number, IsHeightResizeAllowed: boolean, DrawCanvas: CanvasRenderingContext2D): void;

declare function MouseIn(Left: number, Top: number, Width: number, Height: number): boolean;
declare function MouseXIn(Left: number, Width: number): boolean;
declare function MouseYIn(Top: number, Height: number): boolean;

declare function ElementCreateInput(ID: string, Type: string, Value: string, MaxLength: string): HTMLInputElement;
declare function ElementPosition(ElementID: string, X: number, Y: number, W: number, H?: number): void;
declare function ElementPositionFix(ElementID: string, Font: any, X: number, Y: number, W: number, H: number): void;
declare function ElementRemove(ID: string): void;
declare function ElementIsScrolledToEnd(ID: string): boolean;

//Notification.js
type NotificationAlertType = 0 | 1 | 3 | 2;
type NotificationAudioType = 0 | 1 | 2;
declare function NotificationRaise(eventType: string, data: any = {}): void;
declare function NotificationEventHandlerSetup(eventType: string, setting: { AlertType: NotificationAlertType, Audio: NotificationAudioType }): void;


// skill.js
declare function SkillProgress(SkillType: string, SkillProgress: number): void;
declare function SkillSetRatio(SkillType: string, Ratio: number, Push: boolean = true): void;
declare function SkillGetRatio(SkillType: string): number;

// vibrator.js
declare function VibratorModeSetProperty(I: Item, Property: any): void;
declare var VibratorModeOptions: { Standard: { Name: string, Property: any }[], Advanced: { Name: string, Property: any }[] };