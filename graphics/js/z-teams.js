
const teamData = nodecg.Replicant("teamList");
const currentMatch = nodecg.Replicant("currentMatch", {defaultValue: 0});
const matches = nodecg.Replicant("matchList", {
    defaultValue: []
});

let loadedMatch = null;
let loadedMatchIndex = -1;
let cachedRoster;
let cachedTeamList;
let cachedMatchList;

let teamsLoaded = false;
let matchesLoaded = false;

let teamsCallback;
let teamsPreloadCallback;

let matchesCallback;
let matchesPreloadCallback;

let currentMatchCallback;
let currentMatchPreloadCallback;

teamData.on("change", async (newTeams) => {
    if (teamsPreloadCallback) teamsPreloadCallback();
    cachedTeamList = newTeams;
    teamsLoaded = true;
    if (teamsCallback) teamsCallback();
})

matches.on("change", async (matchList) => {
    if (matchesPreloadCallback) matchesPreloadCallback();
    cachedMatchList = matchList;
    matchesLoaded = true;
    if (matchesCallback) matchesCallback();
});

currentMatch.on("change", async (currentMatch) => {
    if (currentMatchPreloadCallback) currentMatchPreloadCallback();
    loadedMatchIndex = currentMatch;
    if (currentMatchCallback) currentMatchCallback();
});

function getTeamById(id){
    if (!cachedTeamList) return;
    return cachedTeamList.filter(team => team.id == id)[0];
}