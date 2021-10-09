console.log(`Loading Teams`);

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
    if (teamsCallback) teamsCallback();
})

matches.on("change", async (matchList) => {
    console.log(`Matches change`, matchList)
    if (matchesPreloadCallback) matchesPreloadCallback();
    cachedMatchList = matchList;
    matchesLoaded = true;
    if (loadedMatchIndex !== undefined) {
        console.log(`loaded match`, loadedMatchIndex)
        loadedMatch = cachedMatchList[loadedMatchIndex];
        if (currentMatchCallback) currentMatchCallback();
    }
    if (matchesCallback) matchesCallback();
});

currentMatch.on("change", async (currentMatch) => {
    console.log(`Current Match change`)
    if (currentMatchPreloadCallback) currentMatchPreloadCallback();
    loadedMatchIndex = currentMatch;
    loadedMatch = cachedMatchList.filter(mtch => mtch.matchId == currentMatch)[0];
    if (currentMatchCallback) currentMatchCallback();
});

matchConfiguration.on("change", async (newConfig) => {
    cachedMatchConfiguration = newConfig;
    if (matchConfigUpdateCallback) matchConfigUpdateCallback();
})

function getTeamById(id) {
    if (!cachedTeamList) return;
    return cachedTeamList.filter(team => team.id == id)[0];
}