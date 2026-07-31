import { extension_settings, loadExtensionSettings } from "../../../extensions.js";
const extensionName = "ST-auto-reply";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultSettings = {
    "start-sign": "【回合交接：",
    "end-sign": "】"

};

async function loadSettings() {
    //Create the settings if they don't exist
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // Updating settings in the UI
    console.log(extension_settings[extensionName]["start-sign"]);
    $("#ST_extension_start").val(extension_settings[extensionName]["start-sign"]);
    $("#ST_extension_end").val(extension_settings[extensionName]["end-sign"]);
}

function save_settings() {
    var start_text, end_text, pattern, target_text;
    const ST_context = SillyTavern.getContext();
    target_text = ST_context.chat[context.chat.length - 1]["mes"];
    start_text = $("#ST_extension_start").value
    end_text = $("#ST_extension_end").value
    pattern = start_text + "(.+)" + end_text;
    var patt = new RegExp(pattern);
    const match = target_text.match(patt);
    console.log(match[1]);
}
// This function is called when the extension is loaded
jQuery(async () => {
    // This is an example of loading HTML from a file
    const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
    $("#extensions_settings").append(settingsHtml);
    $("#auto-reply-apply-button").on("click", save_settings);
    loadSettings();
});