const teamList = nodecg.Replicant("teamList", {
	defaultValue: []
});
const battleRoyaleTeams = nodecg.Replicant("brActiveTeams", { defaultValue: [] });
const matchHistoryEle = document.getElementById("matchHistory");

let cachedTeamList;
let cachedBRTeams;

teamList.on("change", (teamList) => {
	cachedTeamList = teamList;
	console.log("Team List changed");

	/* Remove all options from the select list */
	$("#team").empty();

	/* Insert the new ones from the array above */

	$.each(teamList, function (value) {
		const team = teamList[value];
		if (team) {
			var ele = document.createElement("option");
			console.log("Team Data", team);
			ele.text = team.name;
			ele.id = team.id;
			$("#team").append(ele);
		}
	});

	updateDisplayedMatches();
});

battleRoyaleTeams.on("change", (teams) => {
	cachedBRTeams = teams;
	updateDisplayedMatches();
});

function updateDisplayedMatches() {

	if (cachedBRTeams && cachedTeamList) {
		matchHistoryEle.innerHTML = "";
		$.each(cachedBRTeams, function (value) {
			const match = cachedBRTeams[value];
			if (match && !match.isDeleted) {

				const team1obj = cachedTeamList[match.team];


				const div = document.createElement("div");
				div.id = `match-${value}`;
				div.classList.add("input-group");
				div.classList.add("mb-3");

				if (match.rosterDisplayed) {
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

				const teamScore = document.createElement("input");
				console.log(`team score`, match.teamScore, match)
				div.appendChild(teamScore);
				teamScore.classList.add("form-control");
				teamScore.placeholder = "Team Score"
				teamScore.value = team1obj.teamScore || "";
				teamScore.onchange = function () {
					team1obj.teamScore = teamScore.value || null;
				}

				const teamKills = document.createElement("input");
				div.appendChild(teamKills);
				teamKills.classList.add("form-control");
				teamKills.placeholder = "Team Kills Total"
				teamKills.value = team1obj.teamKills || "";
				teamKills.onchange = function () {
					team1obj.teamKills = teamKills.value || null;
				}

				// const matchNotes = document.createElement("input");
				// div.appendChild(matchNotes);
				// matchNotes.classList.add("form-control");
				// matchNotes.placeholder = "Team Note"
				// matchNotes.value = match.teamNote || "";
				// matchNotes.onchange = function () {
				// 	match.teamNote = matchNotes.value || null;
				// }

				const deleteBtn = document.createElement("button");
				div.appendChild(deleteBtn);
				deleteBtn.classList.add("btn");
				deleteBtn.classList.add("btn-danger");
				deleteBtn.innerHTML = "Delete";

				deleteBtn.onclick = function () {
					//match.isDeleted = true;
					let updatedBR = cachedBRTeams.splice(value, 1);
					cachedBRTeams = updatedBR;
				}

				const showRoster = document.createElement("button");
				div.appendChild(showRoster);
				showRoster.classList.add("btn");
				showRoster.classList.add("btn-success");
				showRoster.innerHTML = "Show Roster";

				showRoster.onclick = function () {
					nodecg.sendMessage(`displayRoster`, { shown: true, teamId: match.team });
				}
				const hideRoster = document.createElement("button");
				div.appendChild(hideRoster);
				hideRoster.classList.add("btn");
				hideRoster.classList.add("btn-warning");
				hideRoster.innerHTML = "Hide Roster";

				hideRoster.onclick = function () {
					nodecg.sendMessage(`displayRoster`, { shown: false, teamId: match.team });
				}

				$("#matchHistory").append(div);
			}
		});
	}

}

function showAll(){
	nodecg.sendMessage(`displayRoster`, { shown: true, all: true });
}

function hideAll(){

	nodecg.sendMessage(`displayRoster`, { shown: false, all: true });
}

function addTeam() {
	let team = cachedTeamList[$("#team").prop('selectedIndex')];
	const newTeam = { team: team.id, teamNote: "", teamScore: 0, playerScores: [0, 0, 0], isDeleted: false, rosterDisplayed: false };
	if (!cachedBRTeams) cachedBRTeams = [];
	cachedBRTeams.push(newTeam);
	//matches.value = cachedMatchList;
}