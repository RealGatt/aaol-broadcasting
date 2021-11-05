let maps;

const mapTemplate = $("#mapTemplate");

for (let mapId = 1; mapId < 8; mapId++) {
	const copiedMap = $(mapTemplate).clone();
	$(copiedMap).html(function () {
		return $(this).html().replace(/\%map%/g, mapId);
	});
	$(copiedMap).attr("id", `map${mapId}group`);
	$(copiedMap).css("display", "")
	$("#mapParent").append(copiedMap);
}

function swapMapScores() {
	if (!loadedMatch) return;

	for (let mapId = 1; mapId < 8; mapId++) {
		if (loadedMatch.maps[mapId - 1]) {
			const map = loadedMatch.maps[mapId - 1];
			if (map) {
				const old1Score = map.team1score;
				const old2Score = map.team2score;
				map.team1score = old2Score;
				map.team2score = old1Score;
			}
		}
	}
}

$.ajax({
	url: "../../assets/data/maps.json",
	success: function (data) {
		maps = data.allmaps;
		console.log("Successfully grabbed Maps.json");
		loadMaps();
	},
});

function loadMaps() {
	maps.forEach(map => {
		const opt = $(`<option value="${map.name}">${map.name} (${map.gamemode})</option>`)
		$(".mapTarget").each((id, tar) => {
			$(tar).append($(opt).clone());
		})
	})
}

useTeam();
teamsCallback = () => {
	updateDisplay();
}
currentMatchCallback = () => {
	updateDisplay();
}
teamsCallback = () => {
	updateDisplay();
}
waitForLoad(() => {
	updateDisplay();
})

const scoreboardSelectMatch = document.getElementById(
	"scoreboardSelectMatch"
);
function updateDisplay() {
	$("#activeMatch").hide();
	$("#noMatch").show();
	console.log("Got call to update Score Manage Display");
	if (!cachedMatchList || !cachedTeamList || loadedMatchIndex == -1) {
		console.log("cache is empty")
		return;
	}

	if (!loadedMatch) return;
	console.log("Cached Team List", cachedTeamList);
	console.log("Loaded Match obj", loadedMatch);
	const team1 = cachedTeamList[loadedMatch.team1];
	const team2 = cachedTeamList[loadedMatch.team2];
	console.log("Teams Loaded", team1, team2);
	$("#scoreboardMatchNameDisplay").text(team1.name + " vs " + team2.name);
	$("#teamNames").html(team1.name + " vs " + team2.name)
	$("#team1score").attr("placeholder", team1.name);
	$("#team2score").attr("placeholder", team2.name);

	$("#team1score").val(loadedMatch.team1score || 0);
	$("#team2score").val(loadedMatch.team2score || 0);

	// Reset background colours
	$("#team1score").css("background-color", "");
	$("#team2score").css("background-color", "");

	if (!loadedMatch.maps) {
		// default AAOL Map pool order
		loadedMatch.maps = [{ map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "Hybrid", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "Escort", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "Assault", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
		{ map: "None", team1score: 0, team2score: 0, done: false, winner: null, draw: false }];
	}

	for (let mapId = 1; mapId < 8; mapId++) {
		if (loadedMatch.maps[mapId - 1]) {
			const map = loadedMatch.maps[mapId - 1];
			if (map) {
				$(`#map${mapId}team1score`).val(map.team1score);
				$(`#map${mapId}team2score`).val(map.team2score);
				$(`#map${mapId}done`).attr("checked", map.done);
				$(`#map${mapId}map`).val(map.map);
			}
		}
	}

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
	$("#activeMatch").show();
	$("#noMatch").hide();
}

function calculateMapWinners(recalc) {
	for (let mapId = 1; mapId < 8; mapId++) {
		let map = loadedMatch.maps[mapId - 1];
		let mapName = $(`#map${mapId}map`).val();
		let mapDone = $(`#map${mapId}done`).prop("checked");
		let team1score = parseInt($(`#map${mapId}team1score`).val());
		let team2score = parseInt($(`#map${mapId}team2score`).val());
		if (map) {
			map.team1score = team1score;
			map.team2score = team2score;
			map.done = mapDone;
			map.map = mapName;
		} else {
			map = {
				map: mapName,
				team1score: team1score,
				team2score: team2score,
				done: mapDone,
				winner: null,
				draw: false
			};
			loadedMatch.maps[mapId - 1] = map;
		}

		if (mapDone) {
			map.draw = (team1score == team2score);
			if (team1score != team2score) {
				map.winner = (team1score > team2score) ? loadedMatch.team1 : loadedMatch.team2;
			}
		} else {
			map.draw = false;
			map.winner = null;
		}
		loadedMatch.maps[mapId - 1] = map;
	}
}

function saveMatch() {
	loadedMatch.matchCompleted = $("#matchComplete").prop("checked");
	loadedMatch.team1score = parseInt($("#team1score").val());
	loadedMatch.team2score = parseInt($("#team2score").val());
	calculateMapWinners();


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
	swapMapScores();
	calculateMapWinners();

	updateDisplay();
}
