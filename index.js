import { handle_usermessage } from "./auto-reply.js"
const { extensionSettings, saveSettingsDebounced } = SillyTavern.getContext();
const { eventSource, event_types } = SillyTavern.getContext();
const context = SillyTavern.getContext();
const extensionName = "ST-auto-reply";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultSettings = Object.freeze({
    "director_name": "导演",
    "bool_add_button": true
});
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
        location.reload()
    }, 3000);
};

function updateButton(status = SillyTavern.getContext().onlineStatus) {
    if (status !== "no_connection") {
        $("#auto-reply-button").removeClass("displayNone");
    }
    else {
        $("#auto-reply-button").addClass("displayNone");
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
        //还要隐藏系统的按钮
        $('#rightSendForm').addClass("displayNone");
        const send_button = '<input id="auto-reply-button" class="menu_button displayNone" type="button" value="发送" />';
        $("#nonQRFormItems").append(send_button);
        $("#auto-reply-button").css("order", 5);
        $("#auto-reply-button").on("click", handle_usermessage);
        eventSource.on(event_types.ONLINE_STATUS_CHANGED, updateButton);
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