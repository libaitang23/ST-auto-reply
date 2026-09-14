const context = SillyTavern.getContext();
/**
 * 
 * @param {string} directorName 导演名字
 * @param {string} groupId 群聊id
 * @returns {string[]} 群聊成员数组
 */
export function get_group_members(directorName, groupId) {
    let cleanStr;
    const groupMembers = [];
    const re = /^(.+)\.(tif|jfif|pjp|apng|xbm|jxl|jpe|jpeg|heif|ico|tiff|webp|svgz|jpg|heic|gif|svg|png|bmp|pjpeg|avif)$/;
    for (const x of context.groups) {
        if (groupId === x["id"]) {
            //遍历members
            for (const y of x["members"]) {
                //是导演就跳过，这里可能需要补错误判断，判断导演是不是在这个组里面
                if (y.includes(directorName)) {
                    continue;
                }
                //正则表达式过滤字符串
                cleanStr = y.match(re)[1];
                if (cleanStr === undefined) {
                    toastr.error("获取成员失败,返回空数组,退出,处理字符串为:", cleanStr);
                    return [];
                }
                groupMembers.push(cleanStr);
            }

            return groupMembers;
        }
    }

}

/**
 * 
 * @param {string} chName 角色名字
 * @returns {number} 角色id
 */
export function get_id(chName) {
    const characters = context.characters;
    for (const ch of Object.keys(characters)) {
        if (characters[ch]["name"] === chName) {
            return Number(ch);
        }
    }
    return null;

}
/**
 * 
 * @param {number} chatLength 指定的长度,例如5条消息就写5
 * @returns {string} 指定长度的聊天上下文
 */
export function get_chat(chatLength) {
    const
        let chatMessage = context.chat;
    let needMessage = "";
    for (let i = chatMessage.length - 1; i >= chatMessage.length - chatLength; i--) {
        needMessage = needMessage + `[角色名字]${chatMessage[i]["name"]}[信息]${chatMessage[i]["mes"]}\n`;
    }
    return needMessage;
}