
const themes = nodecg.Replicant("themes");
const currentTheme = nodecg.Replicant("currentTheme");
const teamData = nodecg.Replicant("teamList");
const teamLogos = nodecg.Replicant("assets:teamlogos");
const battleRoyaleTeams = nodecg.Replicant("brActiveTeams", { defaultValue: [] });

let cachedRoster;
let cachedTeams;
let cachedThemeObj;
let cachedThemes;
let cachedThemeId;
let cachedBRTeams;

let teamsLoaded = false;
let themeLoaded = false;

let teamElements = [];

let heroes = [];
let heroData;

$.ajax({
    url: "../assets/data/heroes.json",
    success: function (data) {
        heroes = data.allheroes;
        heroData = data;
    },
});

function getImageForHero(hero) {
    let heroToAdd = heroData.heroes.filter((heroObj) => {
        return heroObj.name === hero;
    })[0];
    if (heroToAdd) {
        let classToAdd = heroToAdd.img;
        return classToAdd;
    }
    return null;
}

themes.on("change", async (themes) => {
    cachedThemes = themes;
    await updateTheme();
})

currentTheme.on("change", async (themeId) => {
    cachedThemeId = themeId;
    await updateTheme();
})

teamData.on("change", async (newTeams) => {
    cachedTeams = newTeams;
    await updateTeamDisplays();
})

battleRoyaleTeams.on("change", async (teams) => {
    cachedBRTeams = teams;
    await updateTeamDisplays();
});


async function updateTheme() {

    let reloadedTheme = themeLoaded;

    console.log("Theme Stuff", cachedThemeId, cachedThemes);
    if (cachedThemeId === undefined || !cachedThemes) {
        console.log("Can't update theme, something is undefined", cachedThemeId, cachedThemes);
        return;
    }


    console.log("Updating Theme");
    cachedThemeObj = cachedThemes[cachedThemeId];
    $("#userStyle").html(cachedThemeObj.assets.nextMatchCSS || "")
    console.log(cachedThemeObj.assets)

    //Get constant theme data
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

    $('body').css("border-color", colortheme3txt);
    $('.info').css("color", colortheme6txt);
    $('.title, .matchinfo').css("color", colortheme5txt);
    $('.teamscore').css("background-color", colortheme4txt);
    $('.teamkills').css("background-color", colortheme5txt);
    $('.playerscore').css("background-color", colortheme5txt);

    $('.team').css("background-color", colortheme1txt);
    $('.team').css("border-color", colortheme3txt);
    $('.team').css("color", colortheme2txt);

    $('.player').css("background-color", colortheme1txt);
    $('.player').css("border-color", colortheme3txt);
    $('.player').css("color", colortheme2txt);


    $(".teamlogo").css("display", "none");
    $(".playericon").css("display", "none");

    $(`.teamname`).html("LOADING")
    $(`.teamscore`).html(`0`)
    $(`.teamscore`).css("display", "none")
    $(`.teamkills`).html(`0`)
    $(`.teamkills`).css("display", "none")

    $('.teamData').hide();

    themeLoaded = true;
    if (reloadedTheme) await updateTeamDisplays();
    if (themeLoaded && teamsLoaded) $(".LOADING").removeClass("LOADING")

}

async function updateTeamDisplays() {
    if (!cachedBRTeams || !cachedTeams) return;

    let column = 0;
    let teamTemplate = $("#teamTemplate");

    if (!teamsLoaded) {

        $(".wrapper").empty();
        $(".wrapper").html(`<div class="group wf" id="currentRow"></div>`);
    }

    for (let index in cachedBRTeams) {

        if (!teamsLoaded) {
            if (column == 4) {
                column = 0;
                let newRow = $("#currentRow").clone();
                $(newRow).empty();
                $(".wrapper").append(newRow);
                $("#currentRow:first").attr("id", "");
            }
        }

        const brTeam = cachedBRTeams[index];
        if (brTeam.isDeleted) continue;
        console.log(brTeam);
        const team = cachedTeams[brTeam.team];

        console.log("Loading ", team);
        let ele = !teamsLoaded ? $(teamTemplate.children(".teamData")).clone() : $(teamElements[brTeam.team]);
        let currentRow = $("#currentRow");
        $(ele).data("team-data", team);
        $(ele).css("display", "block");
        $(ele).children(".team").children(".teamname").html(team.name);
        if (team.colors) {
            if (team.colors.teamColor) {
                $(ele).children(".team").css("border-color", team.colors.teamColor);
            }
            if (team.colors.playerColor) {
                $(ele).children(".playerData").children(".player").css("border-color", team.colors.playerColor);
            }
        }
        if (team.teamScore) {
            $(ele).children(".team").children(".teamscore").html(team.teamScore);
            $(ele).children(".team").children(".teamscore").show('slow');
        }else{
            $(ele).children(".team").children(".teamscore").hide('slow');
        }
        if (team.teamKills) {
            $(ele).children(".team").children(".teamkills").html(team.teamKills);
            $(ele).children(".team").children(".teamkills").show('slow');
        }else{
            $(ele).children(".team").children(".teamkills").hide('slow');
        }
        if (team.logo) {
            $(ele).children(".team").children(".teamlogo").attr("src", team.logo);
            $(ele).children(".team").children(".teamlogo").css("display", "block");
        }
        if (team.roster) {
            let playerChildren = $(ele).children(".playerData").children(".player");
            console.log(playerChildren);
            for (let player = 0; player < 3; player++) {
                if (team.roster[player] && playerChildren[player] && team.roster[player].name) {
                    $(playerChildren[player]).children(".playername").html(team.roster[player].name);
                    $(playerChildren[player]).children(".playerscore").html(team.roster[player].playerScore || 0);
                    if (team.roster[player].hero) { // replace this with the characters bust
                        $(playerChildren[player]).children(".playericon").attr("src", `../assets/headportraits/${getImageForHero(team.roster[player].hero)}`);
                        $(playerChildren[player]).children(".playericon").css("display", "block");
                    }
                } else {
                    $(playerChildren[player]).hide();
                }
            }
            $(ele).children(".playerData").hide();
        }

        if (!teamsLoaded) {
            console.log(`New Element`, ele);
            $(ele).addClass("LOADING");
            teamElements[brTeam.team] = ele;
            $(currentRow).append(ele);

            column++;
        }
    }


    teamsLoaded = true;

    if (themeLoaded && teamsLoaded) $(".LOADING").removeClass("LOADING")

}


nodecg.listenFor("displayRoster", (shown) => {

    if (shown.all){
        if (shown.shown){
            $(".playerData").show('slow');
        }else{
            $(".playerData").hide('slow');
        }
        return;
    }

    let element = teamElements[shown.teamId];
    if (shown.shown) element.children(".playerData").show('slow');
    else element.children(".playerData").hide('slow');

})