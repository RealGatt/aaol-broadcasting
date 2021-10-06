const teamList = nodecg.Replicant("teamList", {
	defaultValue: []
});
const matchList = nodecg.Replicant("matchList", {
	defaultValue: []
});
const currentMatch = nodecg.Replicant("currentMatch", {defaultValue: 1});
const matchCount = nodecg.Replicant("matchCount", {defaultValue: 0});
const matchHistoryEle = document.getElementById("matchHistory");

let cachedTeamList;
let cachedMatchList;
let cachedCurrentMatch;

teamList.on("change", (teamList) => {
	cachedTeamList = teamList;
	console.log("Team List changed");

	/* Remove all options from the select list */
	$("#team1").empty();
	$("#team2").empty();

	/* Insert the new ones from the array above */

	$.each(teamList, function (value) {
		const team = teamList[value];
		if (team) {
			var ele = document.createElement("option");
			console.log("Team Data", team);
			ele.text = team.name;
			ele.id = team.id;
			$("#team1").append(ele);
			$("#team2").append(ele.cloneNode(true));
		}
	});

	updateDisplayedMatches();
});

matchList.on("change", (matches) => {
	cachedMatchList = matches;
	updateDisplayedMatches();
});

currentMatch.on("change", (newMatch) => {
	cachedCurrentMatch = newMatch;
	updateDisplayedMatches();
});

function updateDisplayedMatches() {
	if (cachedMatchList && cachedTeamList && cachedCurrentMatch !== undefined) {
		matchHistoryEle.innerHTML = "";
		$.each(cachedMatchList, function (value) {
			const match = cachedMatchList[value];
			if (match && !match.isDeleted) {

				const team1obj = cachedTeamList[match.team1];
				const team2obj = cachedTeamList[match.team2];

				console.log("Loaded Match Data", match);

				const div = document.createElement("div");
				div.id = `match-${value}`;
				div.classList.add("input-group");
				div.classList.add("mb-3");

				if (cachedCurrentMatch == match.matchId) {
					const isCurrent = document.createElement("span");
					div.appendChild(isCurrent);
					isCurrent.classList.add("icon");
					isCurrent.classList.add("form-control");
					isCurrent.style.backgroundImage = `url('../assets/white_check_mark.svg')`;
					isCurrent.style.maxWidth = "32px";
					isCurrent.style.maxHeight = "38px";
				}

				const team1image = document.createElement("span");
				div.appendChild(team1image);
				team1image.classList.add("icon");
				team1image.classList.add("form-control");
				team1image.style.backgroundImage = `url('${team1obj.logo}')`;


				const team1 = document.createElement("span");
				div.appendChild(team1);
				team1.classList.add("form-control");
				team1.innerHTML = team1obj.name;

				const team2 = document.createElement("span");
				div.appendChild(team2);
				team2.classList.add("form-control");
				team2.innerHTML = team2obj.name;

				const team2image = document.createElement("span");
				div.appendChild(team2image);
				team2image.classList.add("icon");
				team2image.classList.add("form-control");
				team2image.style.backgroundImage = `url('${team2obj.logo}')`;

				const matchNotes = document.createElement("input");
				div.appendChild(matchNotes);
				matchNotes.classList.add("form-control");
				matchNotes.placeholder = "Match Note"
				matchNotes.value = match.matchNote || "";
				matchNotes.onchange = function () {
					match.matchNote = matchNotes.value || null;
				}

				const deleteBtn = document.createElement("button");
				div.appendChild(deleteBtn);
				deleteBtn.classList.add("btn");
				deleteBtn.classList.add("btn-danger");
				deleteBtn.innerHTML = "Delete";

				deleteBtn.onclick = function () {
					let updatedMatches = cachedMatchList.splice(value, 1);
					cachedMatchList = updatedMatches;
				}

				const swapBtn = document.createElement("button");
				div.appendChild(swapBtn);
				swapBtn.classList.add("btn");
				swapBtn.classList.add("btn-warning");
				swapBtn.innerHTML = "Swap Sides";

				swapBtn.onclick = function () {
					const cacheTeam1 = {
						teamId: match.team1,
						score: match.team1score
					};
					const cacheTeam2 = {
						teamId: match.team2,
						score: match.team2score
					};
					match.team1score = parseInt(cacheTeam2.score);
					match.team2score = parseInt(cacheTeam1.score);

					match.team1 = cacheTeam2.teamId;
					match.team2 = cacheTeam1.teamId;
					matchList.value = cachedMatchList;
				}

				const makeCurrent = document.createElement("button");
				div.appendChild(makeCurrent);
				makeCurrent.classList.add("btn");
				makeCurrent.classList.add("btn-success");
				makeCurrent.innerHTML = "Make Current";

				makeCurrent.onclick = function () {
					currentMatch.value = match.matchId;
					console.log("Updated Current Match to ", match.matchId);
				}

				$("#matchHistory").append(div);
			}
		});
	}
}

function createMatch() {
	console.log("T v T", $("#team1").prop('selectedIndex'), $("#team2").prop('selectedIndex'))
	console.log(cachedTeamList);
	let team1 = cachedTeamList[$("#team1").prop('selectedIndex')];
	let team2 = cachedTeamList[$("#team2").prop('selectedIndex')];
	console.log("Creating Match between", team1, team2);
	const newMatch = { team1: team1.id, team2: team2.id, matchId: matchCount.value, matchNote: "", matchCompleted: false, team1score: 0, team2score: 0 };
	if (!cachedMatchList) cachedMatchList = [];
	cachedMatchList.push(newMatch);
	matchCount.value++;
	//matches.value = cachedMatchList;
}