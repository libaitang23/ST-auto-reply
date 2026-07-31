function get_text() {
    var start_text, end_text, pattern, target_text;
    const ST_context = SillyTavern.getContext();
    target_text = ST_context.chat[context.chat.length - 1]["mes"];
    start_text = document.getElementById("start").value;
    end_text = document.getElementById("end").value;
    pattern = start_text + "(.+)" + end_text;
    var patt = new RegExp(pattern);
    const match = target_text.match(patt);
    console.log(match[1]);
}