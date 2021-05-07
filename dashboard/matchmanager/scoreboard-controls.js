let loadedMatch = null;
let loadedMatchIndex = -1;
const teamList = nodecg.Replicant("teamList", {
	defaultValue: []
});
const matches = nodecg.Replicant("matchList", {
	defaultValue: []
});
const currentMatch = nodecg.Replicant("currentMatch");

let cachedTeamList;
let cachedMatchList;
let cachedCurrentMatch;

const scoreboardSelectMatch = document.getElementById(
	"scoreboardSelectMatch"
);
teamList.on("change", (teamList) => {
	cachedTeamList = teamList;
});

matches.on("change", (matchList) => {
	console.log("Match List changed");

	/* Remove all options from the select list */
	$("#scoreboardSelectMatch").empty();

	/* Insert the new ones from the array above */
	$.each(matchList, function (value) {
		var ele = document.createElement("option");
		const match = matchList[value];
		console.log("Match Data", match);

		const team1 = cachedTeamList[match.team1];
		const team2 = cachedTeamList[match.team2];
		ele.text = team1.name + " vs " + team2.name;
		ele.id = value;
		$("#scoreboardSelectMatch").append(ele);
	});
	//if (loadedMatch == null) loadMatch();
	cachedMatchList = matchList;
	updateDisplay();
});


currentMatch.on("change", (currentMatch)=>{
	loadedMatchIndex = currentMatch;
	console.log("Updated current match to ", currentMatch);
	updateDisplay();
});


function updateDisplay() {
	console.log("Got call to update Score Manage Display");
	if (!cachedMatchList || !cachedTeamList || loadedMatchIndex == -1) {
		console.log("cache is empty")
		return;
	}

	loadedMatch = cachedMatchList[loadedMatchIndex];
	if (!loadedMatch) return;
	console.log("Cached Team List", cachedTeamList);
	console.log("Loaded Match obj", loadedMatch);
	const team1 = cachedTeamList[loadedMatch.team1];
	const team2 = cachedTeamList[loadedMatch.team2];
	console.log("Teams Loaded", team1, team2);
	$("#scoreboardMatchNameDisplay").text(team1.name + " vs " + team2.name);
	$("#team1score").attr("placeholder", team1.name);
	$("#team2score").attr("placeholder", team2.name);


	$("#team1score").val(loadedMatch.team1score || 0);
	$("#team2score").val(loadedMatch.team2score || 0);

	// Reset background colours
	$("#team1score").css("background-color", "");
	$("#team2score").css("background-color", "");

	if (loadedMatch.matchCompleted) {
		if (loadedMatch.team1score > loadedMatch.team2score)
			$("#team1score").css("background-color", "lime");
		else if (loadedMatch.team2score > loadedMatch.team1score)
			$("#team2score").css("background-color", "lime");
		else if (loadedMatch.team1score == loadedMatch.team2score) { // if a tie- they both light up
			$("#team1score").css("background-color", "lime");
			$("#team2score").css("background-color", "lime");
		}
	}
}

function saveMatch() {
	loadedMatch.matchCompleted = $("#matchComplete").prop("checked");
	loadedMatch.team1score = parseInt($("#team1score").val());
	loadedMatch.team2score = parseInt($("#team2score").val());
	console.log("Saved the following Match data", loadedMatch);
}

function resetScores() {
	document.getElementById("team1score").value = 0;
	document.getElementById("team2score").value = 0;
	document.getElementById("matchComplete").checked = false;
	saveMatch();
}

function swapTeams() {

	const cacheTeam1 = {
		teamId: loadedMatch.team1,
		score: loadedMatch.team1score
	};
	const cacheTeam2 = {
		teamId: loadedMatch.team2,
		score: loadedMatch.team2score
	};

	loadedMatch.team1score = cacheTeam2.score;
	loadedMatch.team2score = cacheTeam1.score;

	loadedMatch.team1 = cacheTeam2.teamId;
	loadedMatch.team2 = cacheTeam1.teamId;

	updateDisplay();
}
