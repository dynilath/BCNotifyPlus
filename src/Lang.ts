export class Localization {
    private static CNTextMap = new Map<string, string>([
        ['notify_plus_setting_button_hint', 'Notify Plus 设置'],
        ["notify_friend_online", "[NotifyPlus] CHARANAME(CHARANUM)上线了。"],
        ['notify_plus_setting', '- Notify Plus 设置 -'],
        ['button_mention_notify_setting', '提到名字设置'],
        ['button_online_notify_setting', '上线提示设置'],
        ["chat_notify_setting", "- 提到名字设置 -"],
        ["chat_setting_title_public", "公开"],
        ["chat_setting_title_friend", "好友"],
        ["chat_setting_title_lover", "爱人"],
        ["chat_setting_title_sub", "顺从者"],
        ["chat_setting_title_dom", "支配者"],
        ["chat_setting_input_invalid", "格式错误"],
        ["chat_notify_notification_setting", '提到名字通知'],
        ["online_notify_setting", "- 上线提醒设置 -"],
        ['online_notify_notification_setting', '上线提醒通知'],
        ['online_setting_chat_room_message', '发送聊天消息'],
        ['online_setting_check_friend', '好友'],
        ['online_setting_check_lover', '爱人'],
        ['online_setting_check_sub', '顺从者'],
        ['online_setting_check_dom', '支配者'],
        ['online_notify_setting_col_membernum', '用户编号'],
        ['online_notify_setting_col_name', '名称'],
        ['online_notify_setting_col_activate', '通知?'],
        ['online_notify_setting_add', '添加'],
        ['online_notify_add_hint', '将此ID的玩家添加到通知列表里。'],
        ['online_notify_remove_hint', '移除此玩家。'],
        ['online_notify_cant_find', '没有与此ID的玩家建立关系。'],
        ['chat_notify_popup_title', '聊天消息'],
        ['online_notify_popup_title', '上线消息'],
    ]);

    private static ENTextMap = new Map<string, string>([
        ['notify_plus_setting_button_hint', 'Notify Plus Setting'],
        ["notify_friend_online", "[NotifyPlus] CHARANAME(CHARANUM) is online."],
        ['notify_plus_setting', '- Notify Plus Setting -'],
        ['button_mention_notify_setting', 'Mentioned Setting'],
        ['button_online_notify_setting', 'Online Setting'],
        ["chat_notify_setting", "- Mentioned Setting -"],
        ["chat_setting_title_public", "Public"],
        ["chat_setting_title_friend", "Friends"],
        ["chat_setting_title_lover", "Lovers"],
        ["chat_setting_title_sub", "Subs"],
        ["chat_setting_title_dom", "Dom"],
        ["chat_setting_input_invalid", "Syntax Error"],
        ["chat_notify_notification_setting", 'Mentioned Notification'],
        ["online_notify_setting", "- Online Setting -"],
        ['online_notify_notification_setting', 'Online Notification'],
        ['online_setting_chat_room_message', 'Send Chat Message'],
        ['online_setting_check_friend', 'Friends'],
        ['online_setting_check_lover', 'Lovers'],
        ['online_setting_check_sub', 'Subs'],
        ['online_setting_check_dom', 'Dom'],
        ['online_notify_setting_col_membernum', 'Member No'],
        ['online_notify_setting_col_name', 'Name'],
        ['online_notify_setting_col_activate', 'Notify?'],
        ['online_notify_setting_add', 'Add'],
        ['online_notify_add_hint', 'Add player with this member number to the notify list.'],
        ['online_notify_remove_hint', 'Remove this player.'],
        ['online_notify_cant_find', 'No relationship found with this player.'],
        ['chat_notify_popup_title', 'Chat Message'],
        ['online_notify_popup_title', 'Online Message'],
    ]);

    static GetText(srcTag: string, fill: any = {}) {
        let ret = "";
        if (TranslationLanguage === 'CN') {
            ret = this.CNTextMap.get(srcTag) || srcTag;
        }
        else ret = this.ENTextMap.get(srcTag) || srcTag;

        for (const k in fill) {
            ret = ret.replace(k, fill[k])
        }

        return ret;
    }
}