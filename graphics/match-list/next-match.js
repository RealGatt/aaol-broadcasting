useTheme();
useTeam();

waitForLoad(() => {
    updateTeamDisplays();
    console.log(`Completed Loading`);
    $(".LOADING").removeClass("LOADING")
})


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
}

matchConfigUpdateCallback = () => {
    $(".info").text(cachedMatchConfiguration.matchTitle);
}

teamsCallback = () => {
    updateTeamDisplays();
}

matchesCallback = () => {
    console.log("Match List changed");

    /* Remove all options from the select list */
    $("#scoreboardSelectMatch").empty();

    /* Insert the new ones from the array above */
    $.each(cachedMatchList, function (value) {
        var ele = document.createElement("option");
        const match = cachedMatchList[value];

        const team1 = cachedTeamList[match.team1];
        const team2 = cachedTeamList[match.team2];
        ele.text = team1.name + " vs " + team2.name;
        ele.id = value;
        $("#scoreboardSelectMatch").append(ele);
    });
    //if (loadedMatch == null) loadMatch();
    updateTeamDisplays();
}

currentMatchCallback = () => {
    updateTeamDisplays();
}

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
    if (!loaded) return;
    console.log(`Updating Team Displays`);
    let m = 1;

    let active = 0;
    let complete = 0;
    let totalmatch = 0;

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
        if (match.team1score > 0 || match.team2score > 0) active = 1;
        if (match.matchCompleted) complete++;
        totalmatch++;

        updateColors(m, match);

        m++;
    }

    teamsLoaded = true;

    if (active == 0) {
        $('.title').text("Starting Soon");
        $('.todaywrapper').css("display", "flex");
        $('.nextwrapper').css("display", "none");
    } else if (complete < totalmatch) {
        $('.title').text("Be Right Back");
        $('.todaywrapper').css("display", "flex");
        $('.nextwrapper').css("display", "none");
    } else if (complete >= totalmatch) {
        $('.title').text("Thanks for Watching");
    }
}