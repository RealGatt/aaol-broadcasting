themePreloadCallback = () => {
    for (let m = 0; m < 8; m++) {
        $('.match' + (m + 1) + ' .teamlogo2').css("display", "none");
        $('.match' + (m + 1) + ' .teamlogo1').css("display", "none");
        $('.match' + (m + 1) + ' > .matchinfo').html(`Match ${m + 1}`)
    }
}

themeCallback = async () => {
    await loadColors("nextMatch");
    await loadCustomCSS("nextMatchCSS");
    console.log("Load Callback");
    if (teamsLoaded) teamsLoaded = false;
    await updateTeamDisplays();
    if (themeLoaded && teamsLoaded) $(".LOADING").removeClass("LOADING")
}

const teamData = nodecg.Replicant("teamList");
const currentMatch = nodecg.Replicant("currentMatch", { defaultValue: 0 });
const matches = nodecg.Replicant("matchList", { defaultValue: [] });

let loadedMatch = null;
let loadedMatchIndex = -1;
let cachedRoster;
let cachedTeamList;
let cachedMatchList;
let teamsLoaded = false;

teamData.on("change", async (newTeams) => {
    cachedTeamList = newTeams;
    if (cachedTeamList && cachedMatchList && loadedMatchIndex >= 0) await updateTeamDisplays();
})

matches.on("change", async (matchList) => {
    console.log("Match List changed");

    /* Remove all options from the select list */
    $("#scoreboardSelectMatch").empty();

    /* Insert the new ones from the array above */
    $.each(matchList, function (value) {
        var ele = document.createElement("option");
        const match = matchList[value];

        const team1 = cachedTeamList[match.team1];
        const team2 = cachedTeamList[match.team2];
        ele.text = team1.name + " vs " + team2.name;
        ele.id = value;
        $("#scoreboardSelectMatch").append(ele);
    });
    //if (loadedMatch == null) loadMatch();
    cachedMatchList = matchList;
    if (cachedTeamList && cachedMatchList && loadedMatchIndex >= 0) await updateTeamDisplays();
});


currentMatch.on("change", async (currentMatch) => {
    loadedMatchIndex = currentMatch;
    console.log("Updated current match to ", currentMatch);
    if (cachedTeamList && cachedMatchList && loadedMatchIndex >= 0) await updateTeamDisplays();
});

let legacyMatchList = [];

function updateColors(match, matchData) {

    let team1 = cachedTeamList[matchData.team1];
    let team2 = cachedTeamList[matchData.team2];

    $(`.match${match} .scoreboard`).css(`--left-team-color`, team1.colors.teamColor);
    $(`.match${match} .scoreboard`).css(`--right-team-color`, team2.colors.teamColor);


    if (loadedMatchIndex == matchData.matchId) {
        $(`.match${match} .team1`).addClass('currentMatch')
        $(`.match${match} .team2`).addClass('currentMatch')
    } else {
        $(`.match${match} .team1`).removeClass('currentMatch')
        $(`.match${match} .team2`).removeClass('currentMatch')
    }

    if (matchData.matchCompleted) {
        $(`.match${match} .team1`).addClass('completedMatch')
        $(`.match${match} .team2`).addClass('completedMatch')
    } else {
        $(`.match${match} .team1`).removeClass('completedMatch')
        $(`.match${match} .team2`).removeClass('completedMatch')
    }

    if (matchData.battleRoyaleMode) {
        $(`.match${match} .vs`).html("BATTLE ROYALE");
        $(`.match${match} .vs`).addClass("br");
        $(`.match${match} .teamscore1`).html("0");
        $(`.match${match} .teamscore2`).html("0");
        $(`.match${match} .scorebox`).css("display", "none");
    } else {

        $(`.match${match} .vs`).html("<span>VS</span>");
        $(`.match${match} .vs`).removeClass("br");
        $(`.match${match} .vs`).css("font-size", "");
        $(`.match${match} .vs`).css("line-height", "");
        $(`.match${match} .vs`).css("padding-top", "");
    }
}

function updateDisplay(match, matchData, update) {

    if (update) {
        console.log($(`.match${match} .team1,.match${match} .team2`));
        $(`.match${match} .team1,.match${match} .team2`).hide();
    }


    let team1 = cachedTeamList[matchData.team1];
    let team2 = cachedTeamList[matchData.team2];

    $(`.match${match} .teamname1`).html(team1.name);
    $(`.match${match} .teamname2`).html(team2.name);
    $(`.match${match} > .matchinfo`).html(matchData.matchNote || `Match ${match}`)

    if (team1.logo) {
        $(`.match${match} .teamlogo1`).attr(`src`, team1.logo);
        $(`.match${match} .teamlogo1`).css(`display`, "block");
    } else {
        $(`.match${match} .teamlogo1`).css(`display`, "none");
    }
    if (team2.logo) {
        $(`.match${match} .teamlogo2`).attr(`src`, team2.logo);
        $(`.match${match} .teamlogo2`).css(`display`, "block");
    } else {
        $(`.match${match} .teamlogo2`).css(`display`, "none");
    }

    console.log(team1, team2);

    if (team2.rosterLogo) {
        $(`.match${match}`).css(`--team2background`, `url(${team2.rosterLogo})`);
    } else {
        $(`.match${match}`).css(`--team2background`, "");
    }

    if (team1.rosterLogo) {
        $(`.match${match}`).css(`--team1background`, `url(${team1.rosterLogo})`);
    } else {
        $(`.match${match}`).css(`--team1background`, "");
    }

    if (matchData.matchCompleted || loadedMatchIndex == matchData.matchId || matchData.team1score > 0 || matchData.team2score > 0) {// match has started
        $(`.match${match} .teamscore1`).html(matchData.team1score);
        $(`.match${match} .teamscore2`).html(matchData.team2score);
        $(`.match${match} .scorebox`).show();
    } else {
        $(`.match${match} .teamscore1`).html("0");
        $(`.match${match} .teamscore2`).html("0");
        $(`.match${match} .scorebox`).hide();
    }


    $(`.match${match}`).css("display", "");

    if (update) {

        $(`.match${match} .scoreboard`).addClass("slidein");
        setTimeout(function () {
            $(`.match${match} .scoreboard`).removeClass("slideout");
            setTimeout(function () {
                $(`.match${match} .team1,.match${match} .team2`).show();
            }, 100);
        }, 100);
    }
}

function setScore(match, matchData, update) {
    if (!matchData) return;
    legacyMatchList[matchData.matchId] = JSON.parse(JSON.stringify(matchData));
    console.log(update ? `UPDATING MATCH ${match}` : `NOT UPDATING MATCH ${match}`)

    console.log(cachedTeamList);
    console.log(`Match Data for match ${match}`, matchData);
    if (update) {
        $(`.match${match} .scoreboard`).removeClass("slidein");
        setTimeout(function () {
            $(`.match${match} .scoreboard`).addClass("slideout");
            setTimeout(function () {
                updateDisplay(match, matchData, true);
            }, 1700);
        }, 100);
        return;
    }

    updateDisplay(match, matchData, update);
}

function getLegacyMatch(match) {
    let originalMatch = legacyMatchList[match.matchId];
    return originalMatch ? originalMatch : null;
}

async function updateTeamDisplays() {
    let m = 1;
    for (let potMatch in cachedMatchList) {
        let match = cachedMatchList[potMatch];
        let originalMatch = getLegacyMatch(match);
        console.log(originalMatch)
        if (originalMatch) {
            console.log(`There is an original match for ${match.matchId}`, JSON.stringify(match), JSON.stringify(originalMatch))
            if (originalMatch.team1 != match.team1 || originalMatch.team2 != match.team2) setScore(m, match, true);
            else setScore(m, match, false);
        } else {
            setScore(m, match, false);
        }

        updateColors(m, match);

        m++;
    }

    teamsLoaded = true;

    if (themeLoaded && teamsLoaded) $(".LOADING").removeClass("LOADING")
}

let heroes = [];
let heroData;

