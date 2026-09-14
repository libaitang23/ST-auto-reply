import { group_id, group_members, group_members_str } from "./index.js";
import { get_id, get_chat } from "./getinfo.js"
const context = SillyTavern.getContext();
const { eventSource, event_types } = SillyTavern.getContext();
let end_sign = false;
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
    let nextch_name, next_chid, generate_options, clean_nextch_name;
    //判断群组id
    if (group_id === null) {
        toastr.error("群组id为空,退出");
        return;
    }
    //判断导演名字和输入框是否为空
    if ($("#send_textarea").val() === "") {
        toastr.error("输入框为空,退出");
    }
    if (director_id === null) {
        toastr.error("导演名字错误退出");
        return;
    }
    //移除事件
    $("#auto-reply-button").off("click");
    $("#auto-reply-button").val("停止");
    $("#auto-reply-button").on("click", () => {
        end_sign = true;
        context.stopGeneration();
    })
    await context.generate("normal");
    //循环调度
    while (!end_sign) {
        try {
            nextch_name = await get_nextch(director_id, groupID);
            if (nextch_name === "user") {
                toastr.success('角色调度已完成,轮到用户');
                break;
            }
        } catch (error) {
            console.log("生成中断:", error);
            break;
        }
        clean_nextch_name = nextch_name.trim()
        console.log("下一位说话角色是:", clean_nextch_name)
        next_chid = get_id(clean_nextch_name);
        if (next_chid === null) {
            toastr.error(`找不到用户ID,退出,id:${next_chid},name:${clean_nextch_name}`,);
            break;
        }
        generate_options = {
            "force_chid": Number(next_chid)
        }
        try {
            await context.generate("normal", generate_options);
        }
        catch (error) {
            console.log("生成中断:", error);
            break;
        }


    }
    if (end_sign) {
        end_sign = false;
    }
    //结束后把按钮恢复
    set_sendButton()
}
/**
 * 
 * @param {number} director_id 导演id
 * @param {string} groupID 群聊id
 * @returns {Promise}
 */
async function get_nextch(director_id, groupID) {
    const needMessage = get_chat(5)
    //问导演
    let generate_options = {
        "prompt": `[提示词]:根据当前聊天上下文，从本次请求提供的候选名单中选择下一位发言者。
                    只能原样输出一个候选值。
                    用户需要行动或回应时输出user。
                    禁止生成剧情、解释或其他文字。
                    [聊天上下文]:${needMessage}
                    [聊天角色]:${group_members_str}
        `,
        "systemPrompt": "你是一名酒馆群聊调度助手"
    }
    context.generateRaw()
    return director_message.trim();
}




function set_sendButton() {
    $("#auto-reply-button").val("发送");
    $("#auto-reply-button").off("click");
    $("#auto-reply-button").on("click", handle_usermessage);
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