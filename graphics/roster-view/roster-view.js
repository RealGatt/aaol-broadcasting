const teamData = nodecg.Replicant("teamList");
const teamLogos = nodecg.Replicant("assets:teamlogos");

let cachedRoster;
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

function getClassForHero(hero) {
	let heroToAdd = heroData.heroes.filter((heroObj) => {
		return heroObj.name === hero;
	})[0];
	if (heroToAdd) {
		let classToAdd = heroToAdd.name;
		if (heroToAdd.classOverride)
			classToAdd = heroToAdd.classOverride;

		return classToAdd;
	}
	return null;
}

function setDisplayedRoster(team) {
	console.log("Displaying Team ", team);
	const teamObj = cachedTeams[team];
	const rosterData = teamObj.roster;

	console.log("Data is ", teamObj, rosterData);
	for (let playerId = 1; playerId < 7; playerId++) {
		heroes.forEach((hero) => {
			$("#player" + (playerId)  + " > .rosterDisplay > .heroDisplay").removeClass(getClassForHero(hero));
		});

		console.log(`Loading player ${playerId} (${playerId - 1})`, rosterData[playerId - 1]);
		$("#player" + (playerId) + " > .rosterDisplay > .heroDisplay > .namePlate > .roleIcon").removeClass(["Tank", "DPS", "Support", "Flex"]);
		$("#player" + (playerId) + " > .rosterDisplay > .heroDisplay > .namePlate > .roleIcon").addClass(rosterData[playerId - 1].role);
		$("#player" + (playerId) + " > .rosterDisplay > .heroDisplay > .namePlate > .rosterName").html(rosterData[playerId-1].name);

		if (rosterData[playerId - 1].hero) {
			const hero = rosterData[playerId - 1].hero;
			const classToAdd = getClassForHero(hero);
			console.log("Hero to display is ", hero, classToAdd);
			$("#player" + (playerId) + " > .rosterDisplay > .heroDisplay").addClass(classToAdd);
		}

	}

	$(".teamName").html(teamObj.name);
	$(".teamInformation > img").attr('src', teamObj.rosterLogo);
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
