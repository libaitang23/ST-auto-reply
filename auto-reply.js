const context = SillyTavern.getContext();
const { eventSource, event_types } = SillyTavern.getContext();
// function handle_event() {
//     //监听事件
//     console.log("开始监听")
//     eventSource.on(event_types.USER_MESSAGE_RENDERED, handle_usermessage);
//     //eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, handle_usermessage);
// };
export async function handle_usermessage() {
    //获取输入框信息
    const director_name = $("#input_director_name").val();
    const director_id = get_id(director_name);
    let nextch_name, next_chid, generate_options;
    //判断导演名字
    if (director_id === null) {
        console.log("导演名字错误,不发送");
        return;
    }
    //判断输入框是否为空
    if ($("#send_textarea").val() === "") {
        console.log("输入框为空,不发送");
        return;
    }
    await context.generate("normal");
    //循环调度
    while (true) {
        nextch_name = await get_nextch(director_id);
        if (nextch_name === "user") {
            break
        }
        next_chid = get_id(nextch_name);
        console.log(next_chid);
        if (next_chid === null) {
            console.log("没有找到id,退出")
            break
        }
        generate_options = {
            "force_chid": Number(next_chid)
        }
        await context.generate("normal", generate_options);

    }

}

async function get_nextch(director_id) {
    //问导演
    let generate_options = {
        "force_chid": director_id,
        "quiet_prompt": "请根据当前群聊的剧情、角色关系和最近对话，判断下一位最适合发言的角色。只能选择当前群聊中存在的一名角色,可以选择导演,只输出该角色的完整名字,如果是用户就只输出user,不要输出解释、台词、标点、引号、空格或任何其他内容。"
    }
    const director_message = await context.generate("quiet", generate_options);
    return director_message.trim();
}







function get_id(ch_name) {
    const characters = context.characters;
    for (const ch of Object.keys(characters)) {
        if (characters[ch]["name"] === ch_name) {
            return Number(ch);
        }
    }
    return null;

}



//废案
// function get_director_name() {
//     //群聊id
//     const groupID = context.groupId;
//     //群聊
//     const groups = context.groups;
//     for (const group of groups) {
//         if (groupID === group["id"]) {
//             //找到需要的组
//             for (const member of group["members"]) {
//                 //找到导演
//                 if (member.includes(director_name)) {
//                     //处理名字后缀
//                     const split_strs = member.split(".");
//                     return split_strs[0];
//                 }
//             }
//         }
//     }
//     //没找到返回
//     return null;

// };