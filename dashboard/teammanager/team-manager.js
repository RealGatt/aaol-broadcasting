const teamList = nodecg.Replicant("teamList", {
	defaultValue: []
});
const teamLogos = nodecg.Replicant("assets:teamlogos");
const playerIcons = nodecg.Replicant("assets:player-icons");

let selectedIndex = -1;
let modifyingTeam = null;



let heroes = [];
let heroData;

$.ajax({
	url: "../assets/data/heroes.json",
	success: function (data) {
		heroes = data.allheroes;
		heroData = data;
		console.log("Successfully grabbed Heroes.json");
		loadHeroes();
	},
});

const teamManagerSelectTeam = document.getElementById(
	"teamManagerSelectTeam"
);
const teamManagerSelectLogo = document.getElementById(
	"teamManagerSelectLogo"
);

const teamManagerSelectRosterLogo = document.getElementById("teamManagerSelectRosterLogo");

function addTeam() {
	const newTeamName = document.getElementById("newTeamName").value;
	if (newTeamName && newTeamName.length > 0) {
		const newTeamObj = {
			name: newTeamName,
			id: (teamList.value.length || 0),
			logo: null,
			rosterRoster: null,
			roster: []
		};
		const allTeams = teamList.value || [];
		allTeams[allTeams.length] = newTeamObj;
		// console.log("All Teams", allTeams, newTeamObj);
		teamList.value = allTeams;
	}
}

function saveTeamName() {}

function setLogo() {
	// console.log("Selected Logo", logo);
}

function saveTeamData() {
	const newName = document.getElementById("updateTeamName").value;

	modifyingTeam.name = newName;
	modifyingTeam.logo = $("#teamManagerSelectLogo option:selected").attr("data-image-url");
	modifyingTeam.rosterLogo = $("#teamManagerSelectRosterLogo option:selected").attr("data-image-url");

	modifyingTeam.roster = [];
	console.log(modifyingTeam.roster);

	for (let playerId = 1; playerId < 7; playerId++) {
		const newPlayer = {
			name: $("#rosterPlayer" + playerId).val(),
			role: $("#player" + playerId + "role option:selected").text(),
			profileImage: $("#player" + playerId + "picture option:selected").attr("data-image-url"),
			hero: $("#player" + playerId + "hero option:selected").attr("data-hero")
		};
		modifyingTeam.roster[playerId - 1] = (newPlayer);
		console.log(playerId, newPlayer, modifyingTeam.roster);
	}
	console.log("Saved Team as ", modifyingTeam);

}

function loadTeam() {
	const teamToLoad = teamManagerSelectTeam.selectedIndex;
	modifyingTeam = teamList.value[teamToLoad];
	selectedIndex = teamManagerSelectTeam.selectedIndex

	if (!modifyingTeam.roster) modifyingTeam.roster = [];
	updateDisplay();
}

function updateImage() {
	const logo = teamLogos.value[teamManagerSelectLogo.selectedIndex];
	document.getElementById("teamManagerSelectLogoDisplay").src = logo.url || "";
}

function updateRosterImage() {
	const logo = teamLogos.value[teamManagerSelectRosterLogo.selectedIndex];
	document.getElementById("teamManagerSelectRosterLogoDisplay").src = logo.url || "";
}


function updateDisplay() {
	document.getElementById("teamManagerSelectLogoDisplay").src = modifyingTeam.logo || "";
	const obj = document.getElementById("teamManagerSelectLogo");
	const index = [...document.getElementById("teamManagerSelectLogo").options].findIndex(option =>
		option.getAttribute("data-image-url") === modifyingTeam.logo
	);
	obj.selectedIndex = index;

	document.getElementById("teamManagerSelectRosterLogoDisplay").src = modifyingTeam.rosterLogo || "";
	const obj2 = document.getElementById("teamManagerSelectRosterLogo");
	const index2 = [...document.getElementById("teamManagerSelectRosterLogo").options].findIndex(option =>
		option.getAttribute("data-image-url") === modifyingTeam.rosterLogo
	);
	obj2.selectedIndex = index2;

	document.getElementById("updateTeamName").value = modifyingTeam.name;
	document.getElementById("updateTeamName").disabled = false;
	document.getElementById("teamManagerSelectLogoDisplay").disabled = false;
	document.getElementById("teamManagerSelectLogo").disabled = false;
	document.getElementById("teamManagerSelectRosterLogoDisplay").disabled = false;
	document.getElementById("teamManagerSelectRosterLogo").disabled = false;
	document.getElementById("saveTeamButton").disabled = false;

	for (let playerId = 1; playerId < 7; playerId++) {
		// console.log(playerId);
		document.getElementById("rosterPlayer" + playerId).disabled = false;
		document.getElementById("player" + playerId + "role").disabled = false;
		document.getElementById("player" + playerId + "picture").disabled = false;
		document.getElementById("player" + playerId + "hero").disabled = false;
	}


	for (let playerId = 1; playerId < 7; playerId++) {
		const player = modifyingTeam.roster[playerId - 1];
		if (player) {
			$("#rosterPlayer" + playerId).val(player.name);
			$("#player" + playerId + "role").val(player.role);
			const iconIndex = [...document.getElementById("player" + playerId + "picture").options].findIndex(option =>
				option.getAttribute("data-image-url") === player.profileImage
			);
			$("#player" + playerId + "picture").prop("selectedIndex", iconIndex);
		}
	}

}

teamList.on("change", (teamList) => {
	// console.log("Team List changed");

	/* Remove all options from the select list */
	$("#teamManagerSelectTeam").empty();

	/* Insert the new ones from the array above */

	$.each(teamList, function (value) {
		const team = teamList[value];
		if (team) {
			var ele = document.createElement("option");
			// console.log("Team Data", team);
			ele.text = team.name;
			ele.id = team.id;
			$("#teamManagerSelectTeam").append(ele);
		}
	});
	if (modifyingTeam) updateDisplay();
	if (selectedIndex >= 0) teamManagerSelectTeam.selectedIndex = selectedIndex;
});

teamLogos.on("change", (logoList) => {
	// console.log("Loaded Team Logos", logoList);

	/* Remove all options from the select list */
	$("#teamManagerSelectLogo").empty();
	$("#teamManagerSelectRosterLogo").empty();

	/* Insert the new ones from the array above */
	$.each(logoList, function (value) {
		var ele = document.createElement("option");
		const image = logoList[value];
		// console.log("Image Data", image);
		ele.text = image.base;
		ele.id = value;
		ele.setAttribute("data-image-url", image.url);
		$("#teamManagerSelectLogo").append(ele);
		$("#teamManagerSelectRosterLogo").append($(ele).clone());
	});
});

playerIcons.on("change", (playerIcons) => {
	$(".playerIcons").empty();

	/* Insert the new ones from the array above */
	$.each(playerIcons, function (value) {
		var ele = document.createElement("option");
		const image = playerIcons[value];
		ele.text = image.base;
		ele.id = value;
		ele.setAttribute("data-image-url", image.url);
		$(".playerIcons").append(ele);
	});
})

function loadHeroes() {
	$(".playerHeroes").empty();

	$.each(heroes, function (value) {
		const hero = heroes[value];
		var ele = document.createElement("option");
		ele.text = hero;
		ele.id = hero;
		ele.setAttribute("data-hero", hero);
		$(".playerHeroes").append(ele);
	})
}
