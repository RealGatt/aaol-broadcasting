
const teamData = nodecg.Replicant("teamList");
const matches = nodecg.Replicant("matchList", {
    defaultValue: []
});
const currentMatch = nodecg.Replicant("currentMatch", { defaultValue: 0 });
const matchConfiguration = nodecg.Replicant("matchConfiguration", {
    defaultValue: {
        matchTitle: "SET ME",
        casters: ["Caster 1", "Caster 2"],
    },
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

let cachedMatchConfiguration;
let matchConfigUpdateCallback;

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
    loadedMatch = cachedMatchList[currentMatch];
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