export function DefaultValue(): NotifyPlusSolidSetting {
    return {
        chatNotify: {
            setting: {
                AlertType: 0,
                Audio: 0
            },
            public: ["saki", "saotome", "saki saotome"],
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