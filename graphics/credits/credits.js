const teamData = nodecg.Replicant("teamList");
const teamLogos = nodecg.Replicant("assets:teamlogos");
const themes = nodecg.Replicant("themes");
const currentTheme = nodecg.Replicant("currentTheme");

let cachedThemeObj;
let cachedThemes;
let cachedThemeId;


themes.on("change", (themes) => {
    cachedThemes = themes;
    updateTheme();
})

currentTheme.on("change", (themeId) => {
    cachedThemeId = themeId;
    updateTheme();
})

function updateTheme() {
    console.log("Theme Stuff", cachedThemeId, cachedThemes);
    if (cachedThemeId === undefined || !cachedThemes) {
        console.log("Can't update theme, something is undefined", cachedThemeId, cachedThemes);
        return;
    }
    console.log("Updating Theme");
    cachedThemeObj = cachedThemes[cachedThemeId];

    let colortheme1txt = cachedThemeObj.assets.primaryColor;
    let colortheme2txt = cachedThemeObj.assets.secondaryColor;
    let colortheme3txt = cachedThemeObj.assets.tertiaryColor;
    let colortheme4txt = cachedThemeObj.assets.quaternaryColor;
    let colortheme5txt = cachedThemeObj.assets.quinaryColor;
    let colortheme6txt = cachedThemeObj.assets.senaryColor;

    $("#themeColors").html(`:root {
    --PRIMARY: ${colortheme1txt} !important;
    --SECONDARY: ${colortheme2txt} !important;
    --TERTIARY: ${colortheme3txt} !important;
    --QUATERNARY: ${colortheme4txt} !important;
    --QUINARY: ${colortheme5txt} !important;
    --SENARY: ${colortheme6txt} !important;
}`);

    $('body').css("border-color", (colortheme3txt));
    //$('.team').css("color", colortheme2txt);
    $('.matchinfo, .socials, .title').css("color", colortheme5txt);
    $('.teamscore, .gg').css("color", colortheme3txt);
    //$('.team').css("background-color", colortheme1txt);
    //$('.team').css("border-color", colortheme3txt);
    $('.vs').css("background-color", colortheme3txt);
    $('.vs').css("color", colortheme1txt);
    $('.scorebox').css("background-color", colortheme4txt);

    $('body').css("border-color", colortheme3txt);
    $('.info').css("color", colortheme6txt);
    //$('.camerahole').css("background-color", (colortheme3txt));

    $('span.tertiary').css("background-color", (colortheme1txt));
    $('span.tertiary').css("color", (colortheme2txt));
    $('span.tertiary').css("border-color", (colortheme3txt));

    $("#userStyle").html(cachedThemeObj.assets.rosterCSS)
    if (cachedThemeObj.assets.credits)
        $("#credits").html(cachedThemeObj.assets.credits);
}