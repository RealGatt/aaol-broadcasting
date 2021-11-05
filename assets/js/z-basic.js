let usingThemes = false;
let usingTeams = false;
let usingMaps = false;

let anyUpdateCallback;

let themes;
let currentTheme;

let themePreloadCallback;
let themeCallback;

let teamData;
let matches;
let currentMatch;
let matchConfiguration;

let teamsCallback;
let teamsPreloadCallback;

let matchesCallback;
let matchesPreloadCallback;

let currentMatchCallback;
let currentMatchPreloadCallback;

let cachedMatchConfiguration;
let matchConfigUpdateCallback

let loaded = false;

function useMaps() {
    usingMaps = true;
    const newScript = document.createElement("script");
    newScript.onload = () => {
    }
    newScript.src = "../../assets/js/z-maps.js";
    newScript.defer = true;
    document.head.appendChild(newScript);
}

function useTheme() {
    usingThemes = true;
    themes = nodecg.Replicant("themes");
    currentTheme = nodecg.Replicant("currentTheme");
    const newScript = document.createElement("script");
    newScript.onload = () => {
    }
    newScript.src = "../../assets/js/z-theme.js";
    newScript.defer = true;
    document.head.appendChild(newScript);
}

function useTeam() {
    usingTeams = true;
    teamData = nodecg.Replicant("teamList");
    matches = nodecg.Replicant("matchList", {
        defaultValue: []
    });
    currentMatch = nodecg.Replicant("currentMatch", { defaultValue: 0 });
    matchConfiguration = nodecg.Replicant("matchConfiguration", {
        defaultValue: {
            matchTitle: "SET ME",
            casters: ["Caster 1", "Caster 2"],
        },
    });
    const newScript = document.createElement("script");
    newScript.onload = () => {
    }
    newScript.src = "../../assets/js/z-teams.js";
    newScript.defer = true;
    document.head.appendChild(newScript);
}

function waitForLoad(callback) {
    setTimeout(() => {
        const reps = [];
        console.log(`Got Wait for Load callback`, usingThemes, usingTeams)
        if (usingThemes)
            reps.push(themes, currentTheme);

        if (usingTeams)
            reps.push(teamData,
                matches,
                currentMatch,
                matchConfiguration)

        console.log(`waiting for these replicants`, reps);

        console.log(`Replicants Loaded. Running Callback`);
        NodeCG.waitForReplicants(...reps).then(async () => {

            if (anyUpdateCallback) anyUpdateCallback();

            if (themeCallback) themeCallback();
            if (teamsCallback) teamsCallback();
            if (matchesCallback) matchesCallback();
            if (currentMatchCallback) currentMatchCallback();
            if (matchConfigUpdateCallback) matchConfigUpdateCallback();

            loaded = true;

            await callback();
        })
    }, 300)

}