
$("head").append("<style id='globalCSS'></style>");
$("head").append("<style id='themeColors'></style>");
$("head").append("<style id='themeBonusColors'></style>");
$("head").append("<style id='userStyle'></style>");

let cachedThemes;
let cachedThemeId;
let cachedThemeObj;

let themeLoaded = false;

themes.on("change", async (themes) => {
    cachedThemes = themes;
    updateTheme().then(() => {
        if (themeCallback) themeCallback();
        if (anyUpdateCallback) anyUpdateCallback();
    })
})

currentTheme.on("change", async (themeId) => {
    cachedThemeId = themeId;
    updateTheme().then(() => {
        if (themeCallback) themeCallback();
        if (anyUpdateCallback) anyUpdateCallback();
    })
})

async function updateTheme(callback) {
    if (cachedThemeId === undefined || !cachedThemes) {
        console.log("Can't update theme, something is undefined", cachedThemeId, cachedThemes);
        return;
    }
    if (themePreloadCallback) themePreloadCallback();
    console.log("Updating Theme", cachedThemeId, cachedThemes);
    cachedThemeObj = cachedThemes[cachedThemeId];
    if (!cachedThemeObj) { console.log("Cached theme has no assets"); return; };

    $("#globalCSS").html(cachedThemeObj.assets.globalCSS || "")

    $("#themeColors").html(`:root {
        --PRIMARY: ${cachedThemeObj.assets.primaryColor.value || "#FFFFFF"} !important;
        --SECONDARY: ${cachedThemeObj.assets.secondaryColor.value || "#FFFFFF"} !important;
        --TERTIARY: ${cachedThemeObj.assets.tertiaryColor.value || "#FFFFFF"} !important;
        --QUATERNARY: ${cachedThemeObj.assets.quaternaryColor.value || "#FFFFFF"} !important;
        --QUINARY: ${cachedThemeObj.assets.quinaryColor.value || "#FFFFFF"} !important;
        --SENARY: ${cachedThemeObj.assets.senaryColor.value || "#FFFFFF"} !important;
        --SEPTENARY: ${cachedThemeObj.assets.septenaryColor.value || "#FFFFFF"} !important;
        --OCTONARY: ${cachedThemeObj.assets.octonaryColor.value || "#FFFFFF"} !important;
        --LEFT-TEAM: ${cachedThemeObj.assets.teamLeftColor.value} !important;
        --RIGHT-TEAM: ${cachedThemeObj.assets.teamRightColor.value} !important;
        --FONT: ${cachedThemeObj.assets.font} !important;
        --SCOREBOX-Y-OFFSET: ${cachedThemeObj.assets.scoreboxYOffset} !important;
        --SCOREBOX-VS-FONTSIZE: ${cachedThemeObj.assets.scoreboxVSFontSize} !important;
    }`);

    themeLoaded = true;
    if (callback) callback();
}

async function loadColors(key, callback) {
    if (!themeLoaded) return;
    let addons = [];
    for (let k in cachedThemeObj.assets) {
        if (k.startsWith(key))
            addons.push(`--${k}: ${cachedThemeObj.assets[k].value || cachedThemeObj.assets[k]};`)
    }
    $("#themeBonusColors").html(`:root {${addons.join("\n")}}`)
    if (callback) callback();
}

async function loadCustomCSS(target, callback) {
    if (!themeLoaded) return;
    $("#userStyle").html(cachedThemeObj.assets[target] || "")
    if (callback) callback();
}