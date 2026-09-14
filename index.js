import { handle_usermessage } from "./auto-reply.js";
import { get_group_members } from "./getinfo.js"
const { extensionSettings, saveSettingsDebounced } = SillyTavern.getContext();
const { eventSource, event_types } = SillyTavern.getContext();
const context = SillyTavern.getContext();
const extensionName = "ST-auto-reply";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultSettings = Object.freeze({
    "director_name": "导演",
    "bool_add_button": true
});

export let group_id = null;
export let group_members = null;
export let group_members_str = "";
async function loadSettings() {
    //Create the settings if they don't exist
    if (!extensionSettings[extensionName]) {
        extensionSettings[extensionName] = structuredClone(defaultSettings);
    }
    for (const key of Object.keys(defaultSettings)) {
        if (!Object.hasOwn(extensionSettings[extensionName], key)) {
            extensionSettings[extensionName][key] = defaultSettings[key];
        }
    }
    // 使用设置
    $("#input_director_name").val(extensionSettings[extensionName]["director_name"]);
    if (!extensionSettings[extensionName]["bool_add_button"]) {
        //为false时不勾选
        $("#create_append_but").prop("checked", false)
    }
    //保存设置
    saveSettingsDebounced();


};
function save_settings() {
    const director_name = $("#input_director_name").val();
    extensionSettings[extensionName]["director_name"] = director_name;
    if ($("#create_append_but").prop("checked")) {
        //判断是否创建按钮
        extensionSettings[extensionName]["bool_add_button"] = true;
    }
    else {
        extensionSettings[extensionName]["bool_add_button"] = false;
    }
    saveSettingsDebounced();
    setTimeout(() => {
        location.reload();
    }, 1000);
};


function enableButton() {
    const sysBut_class = $("#rightSendForm").prop("class");
    const status = SillyTavern.getContext().groupId;
    const but_class = $("#auto-reply-button").prop("class");
    const online_status = SillyTavern.getContext().onlineStatus;
    if (status !== null && online_status !== "no_connection") {
        if (!sysBut_class.includes("displayNone")) {
            //如果系统按钮还没隐藏，顺手隐藏
            $("#rightSendForm").addClass("displayNone");
        }
        if (but_class.includes("displayNone")) {
            //如果自己按钮还没恢复，顺手恢复
            $("#auto-reply-button").removeClass("displayNone");
        }
        //进入群聊，把当前id传入groupID
        group_id = status;
        console.log(group_id);
        group_members = get_group_members($("#input_director_name").val(), status);
        //判断是否是空数组
        if (group_members === []) {
            toastr.error('无法获取到群聊角色');
            return
        }
        //遍历数组设置元素value
        for (const x of group_members) {
            group_members_str = group_members_str + x + " ";
        }
        $("#input_group_members").val(group_members_str);
        toastr.success('进入群聊,激活发送按键');

    }
    if (status === null && online_status !== "no_connection") {
        if (sysBut_class.includes("displayNone")) {
            //如果系统按钮还没恢复，顺手恢复
            $("#rightSendForm").removeClass("displayNone");
        }
        if (!but_class.includes("displayNone")) {
            //如果自己按钮还没隐藏，顺手隐藏
            $("#auto-reply-button").addClass("displayNone");
        }


    }
}


// This function is called when the extension is loaded
jQuery(async () => {
    // This is an example of loading HTML from a file
    const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
    $("#extensions_settings").append(settingsHtml);
    $("#auto-reply-apply-button").on("click", save_settings);
    loadSettings();
    if (extensionSettings[extensionName]["bool_add_button"]) {
        //定义一个按钮
        const send_button = '<input id="auto-reply-button" class="menu_button displayNone" type="button" value="发送" />';
        $("#nonQRFormItems").append(send_button);
        $("#auto-reply-button").css("order", 5);
        $("#auto-reply-button").on("click", handle_usermessage);
        //事件对接
        eventSource.on(event_types.ONLINE_STATUS_CHANGED, enableButton);
        eventSource.on(event_types.CHAT_CHANGED, enableButton);
    }
});

//nonQRFormItems
// let start_text, end_text, pattern, target_text;
// const ST_context = SillyTavern.getContext();
// target_text = ST_context.chat[context.chat.length - 1]["mes"];
// start_text = $("#ST_extension_start").value;
// end_text = $("#ST_extension_end").value;
// pattern = start_text + "(.+)" + end_text;
// const patt = new RegExp(pattern);
// const match = target_text.match(patt);
// console.log(match[1]);




//
// if (!st_class.includes("displayNone")) {
//     //如果系统按钮还没隐藏，顺手隐藏
//     $("#rightSendForm").addClass("displayNone");
// }
// toastr.success('进入群聊,激活发送按键');
// $("#auto-reply-button").prop("disabled", false);


// if (st_class.includes("displayNone")) {
//     //如果系统按钮还没恢复，顺手恢复
//     $("#rightSendForm").removeClass("displayNone");
// }
// toastr.info('未进入群聊,禁止系统按键');
// $("#auto-reply-button").prop("disabled", true);