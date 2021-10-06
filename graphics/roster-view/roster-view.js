let heroes = [];
let heroData;

$.ajax({
	url: "../assets/data/heroes.json",
	success: function (data) {
		heroes = data.allheroes;
		heroData = data;
	},
});

themeCallback = () => {
	loadColors("rosterView");
	loadCustomCSS("rosterCSS");
}

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
	const teamObj = cachedTeamList[team];
	const rosterData = teamObj.roster;

	console.log("Data is ", teamObj, rosterData);
	for (let playerId = 1; playerId < 7; playerId++) {
		heroes.forEach((hero) => {
			$("#player" + (playerId) + " > .heroDisplay").removeClass(getClassForHero(hero));
		});

		console.log(`Loading player ${playerId} (${playerId - 1})`, rosterData[playerId - 1]);
		$("#player" + (playerId) + " > .heroDisplay > .namePlate > .roleIcon").removeClass(["Tank", "DPS", "Support", "Flex"]);
		$("#player" + (playerId) + " > .heroDisplay > .namePlate > .roleIcon").addClass(rosterData[playerId - 1].role);
		$("#player" + (playerId) + " > .heroDisplay > .namePlate > .rosterName").html(rosterData[playerId - 1].name);
		$("#player" + (playerId) + " > .heroDisplay > .namePlate > .playerQuote").html(rosterData[playerId - 1].quote || "");

		if (rosterData[playerId - 1].hero) {
			const hero = rosterData[playerId - 1].hero;
			const classToAdd = getClassForHero(hero);
			console.log("Hero to display is ", hero, classToAdd);
			$("#player" + (playerId) + " > .heroDisplay").addClass(classToAdd);
		}
	}
	$(".topText").html(teamObj.name);

	$("img.logo").attr('src', teamObj.logo);

	$("#teamStyle").html(`:root { --TEAM-COLOR: ${teamObj.colors.teamColor};
	--PLAYER-COLOR: ${teamObj.colors.playerColor}; }`)
}

let displayedState = false;

function displayRoster(team, text) {
	if (!displayedState) {
		setDisplayedRoster(team);
		setTimeout(function () {
			showRoster();
		}, 1000);
	} else {
		hideRoster();
		setTimeout(function () {
			setDisplayedRoster(team);
		}, 1500);
		setTimeout(function () {
			showRoster();
		}, 2100);
	}
}

function hideRoster() {
	$(".playerDisplay").addClass("offscreen");
	$(".teamInformation").addClass("offscreen");
	$(".namePlate").addClass("offscreen");
	displayedState = false;
}

function showRoster() {
	$(".LOADING").removeClass("LOADING");
	$(".offscreen").removeClass("offscreen");
	$(".teamInformation").removeClass("offscreen");
	$(".namePlate").removeClass("offscreen");
	displayedState = true;
}

nodecg.listenFor('updateRosterDisplay', (data) => {
	var urlParams = new URLSearchParams(window.location.search);

	const shown = data.shown;
	const teamId = data.teamId;
	
	const displayTitle = data.displayTitle || urlParams.get("sceneTitle");
	console.log("Got call", shown, teamId);
	if (teamId !== null) {
		if (shown)
			displayRoster(teamId, displayTitle);
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
