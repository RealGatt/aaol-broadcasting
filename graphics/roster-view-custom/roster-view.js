const teamData = nodecg.Replicant("teamList");
const teamLogos = nodecg.Replicant("assets:teamlogos");

let cachedTeams;

teamData.on("change", (newTeams) => {
	cachedTeams = newTeams;
})

let heroes = [];
let heroData;

$.ajax({
	url: "../assets/data/heroes.json",
	success: function (data) {
		heroes = data.allheroes;
		heroData = data;
	},
});

function setDisplayedRoster(team) {
	console.log("Displaying Team ", team);
	const teamObj = cachedTeams[team];
	const rosterData = teamObj.roster;
	
	console.log("Data is ", teamObj, rosterData);
	for (let playerId = 1; playerId < 7; playerId++) {
		console.log(playerId, rosterData[playerId - 1]);
		const player = rosterData[playerId - 1];
		console.log($("#" + playerId));
		$("#player" + playerId + " > .playerIcon").attr('src', player.profileImage || null);
		$("#player" + playerId + " > .roleIcon").removeClass(["Tank", "DPS", "Support", "Flex"]);
		$("#player" + playerId + " > .roleIcon").addClass(player.role);
		$("#player" + playerId + " > .rosterName").html(`${player.name}`);
	}

	$(".teamName").html(teamObj.name);
	$(".teamLogo").attr('src', teamObj.rosterLogo || teamObj.logo);
}

let displayedState = false;

function displayRoster(team) {
	hideRoster();
	setTimeout(function () {
		setDisplayedRoster(team);
	}, 2000);
	setTimeout(function () {
		showRoster();
	}, 4000);
}

function hideRoster() {
	$(".playerDisplay").addClass("offscreen");
	$(".teamInformation").addClass("offscreen");
	displayedState = false;
}

function showRoster() {
	$(".offscreen").removeClass("offscreen");
	$(".teamInformation").removeClass("offscreen");
	displayedState = true;
}

nodecg.listenFor('updateRosterDisplay', (data) => {
	const shown = data.shown;
	const teamId = data.teamId;
	console.log("Got call", shown, teamId);
	if (teamId !== null) {
		if (shown)
			displayRoster(teamId);
		else
			setDisplayedRoster(teamId);
		return;
	}

	if (shown) {
		showRoster();
	} else {
		hideRoster();
	}

})

nodecg.listenFor('toggleDisplay', (shown) => {
	if (shown) {
		showRoster();
	} else {
		hideRoster();
	}
});

nodecg.listenFor('showRoster', (team) => {
	displayRoster(team);
});
