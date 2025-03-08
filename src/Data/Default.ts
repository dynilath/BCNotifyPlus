export function DefaultValue(nickname: string): NotifyPlusSolidSetting {
    return {
        chatNotify: {
            setting: {
                AlertType: 0,
                Audio: 0
            },
            public: nickname.split(" ").map((_: string) => _.toLowerCase()),
            friend: [],
            lover: ["dear", "treasure"],
            sub: ["master", "mistress"],
            dom: []
        },
        onlineNotify: {
            setting: {
                AlertType: 0,
                Audio: 0
            },
            chatMsg: true,
            notifies: {
                friend: false,
                lover: true,
                sub: true,
                dom: true,
                spec: [],
            }
        }
    };
}