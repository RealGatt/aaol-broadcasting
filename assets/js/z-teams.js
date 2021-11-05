console.log(`Loading Teams`);
$("head").append("<style id='teamColors'></style>");

let loadedMatch = null;
let loadedMatchIndex = -1;

let cachedRoster;
let cachedTeamList;
let cachedMatchList;

let teamsLoaded = false;
let matchesLoaded = false;

teamData.on("change", async (newTeams) => {
    if (teamsPreloadCallback) teamsPreloadCallback();
    cachedTeamList = newTeams;
    teamsLoaded = true;
    setTeamColors();
    if (teamsCallback) teamsCallback(); if (anyUpdateCallback) anyUpdateCallback();
})

matches.on("change", async (matchList) => {
    console.log(`Matches change`, matchList)
    if (matchesPreloadCallback) matchesPreloadCallback();
    cachedMatchList = matchList;
    matchesLoaded = true;
    if (loadedMatchIndex !== undefined) {
        console.log(`loaded match`, loadedMatchIndex)
        loadedMatch = cachedMatchList.filter(mtch => mtch.matchId == loadedMatchIndex)[0];
        if (currentMatchCallback) currentMatchCallback();
    }
    setTeamColors();
    if (matchesCallback) matchesCallback(); if (anyUpdateCallback) anyUpdateCallback();
});

currentMatch.on("change", async (currentMatch) => {
    console.log(`Current Match change`)
    if (currentMatchPreloadCallback) currentMatchPreloadCallback();
    loadedMatchIndex = currentMatch;
    loadedMatch = cachedMatchList.filter(mtch => mtch.matchId == loadedMatchIndex)[0];
    setTeamColors();
    if (currentMatchCallback) currentMatchCallback(); if (anyUpdateCallback) anyUpdateCallback();
});

matchConfiguration.on("change", async (newConfig) => {
    cachedMatchConfiguration = newConfig;
    setTeamColors();
    if (matchConfigUpdateCallback) matchConfigUpdateCallback(); if (anyUpdateCallback) anyUpdateCallback();
})

function setTeamColors() {
    if (!loadedMatch) return;
    const team1 = getTeamById(loadedMatch.team1);
    const team2 = getTeamById(loadedMatch.team2);

    $("#teamColors").html(`:root {
        --team1BorderColor: ${team1.colors.borderColor};
        --team1PlayerColor: ${team1.colors.playerColor};
        --team1TeamColor: ${team1.colors.teamColor};
        --team2BorderColor: ${team2.colors.borderColor};
        --team2PlayerColor: ${team2.colors.playerColor};
        --team2TeamColor: ${team2.colors.teamColor};
    }`)
}

function getTeamById(id) {
    if (!cachedTeamList) return;
    return cachedTeamList.filter(team => team.id == id)[0];
}