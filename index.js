import { extension_settings, loadExtensionSettings } from "../../../extensions.js";
// Keep track of where your extension is located, name should match repo name
const extensionName = "ST-auto-reply";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


function get_text() {
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

    // Append settingsHtml to extensions_settings
    // extension_settings and extensions_settings2 are the left and right columns of the settings menu
    // Left should be extensions that deal with system functions and right should be visual/UI related 
    $("#extensions_settings").append(settingsHtml);
    // Load settings when starting things up (if you have any)
    //loadSettings();
});