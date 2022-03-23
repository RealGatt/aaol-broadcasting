useTeam();
teamsCallback = () => {
	$("#teamManagerSelectTeam").empty();

	/* Insert the new ones from the array above */

	$.each(cachedTeamList, function (value) {
		const team = cachedTeamList[value];
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
}
waitForLoad(() => {
	updateDisplay();
})

const teamLogos = nodecg.Replicant("assets:teamlogos");
const playerIcons = nodecg.Replicant("assets:player-icons");

let selectedIndex = -1;
let modifyingTeam = null;

let heroes = [];
let heroData;

$.ajax({
	url: "../../assets/data/heroes.json",
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
			id: (cachedTeamList.length || 0),
			logo: null,
			rosterRoster: null,
			roster: [],
			colors: { teamColor: "#ffffff", playerColor: "#A4F0CA" }
		};
		const allTeams = cachedTeamList || [];
		allTeams[allTeams.length] = newTeamObj;
		// console.log("All Teams", allTeams, newTeamObj);
		cachedTeamList = allTeams;
	}
}

function saveTeamName() { }

function setLogo() {
	// console.log("Selected Logo", logo);
}

function saveTeamData() {
	const newName = document.getElementById("updateTeamName").value;

	modifyingTeam.name = newName;
	modifyingTeam.logo = $("#teamManagerSelectLogo option:selected").attr("data-image-url");
	modifyingTeam.rosterLogo = $("#teamManagerSelectRosterLogo option:selected").attr("data-image-url");

	modifyingTeam.colors = { teamColor: $("#teamColor").val(), playerColor: $("#playerColor").val(), borderColor: $("#borderColor").val() }

	modifyingTeam.roster = [];
	console.log($("#teamColor").val(), $("#playerColor").val())
	console.log(modifyingTeam.roster);

	for (let playerId = 1; playerId < 7; playerId++) {
		const newPlayer = {
			name: $("#rosterPlayer" + playerId).val(),
			role: $("#player" + playerId + "role option:selected").text(),
			hero: $("#player" + playerId + "hero option:selected").attr("data-hero"),
			quote: $("#rosterPlayer" + playerId + "Quote").val()
		};
		modifyingTeam.roster[playerId - 1] = (newPlayer);
		console.log(playerId, newPlayer, modifyingTeam.roster);
	}
	console.log("Saved Team as ", modifyingTeam);

}

function loadTeam() {
	const teamToLoad = teamManagerSelectTeam.selectedIndex;
	modifyingTeam = cachedTeamList[teamToLoad];
	selectedIndex = teamManagerSelectTeam.selectedIndex

	if (!modifyingTeam.roster) modifyingTeam.roster = [];
	updateDisplay();
}

function updateImage() {
	const logo = teamLogos.value[teamManagerSelectLogo.selectedIndex - 1] || { url: "" };
	document.getElementById("teamManagerSelectLogoDisplay").src = logo.url;
}

function updateRosterImage() {
	const logo = teamLogos.value[teamManagerSelectRosterLogo.selectedIndex - 1] || { url: "" };
	document.getElementById("teamManagerSelectRosterLogoDisplay").src = logo.url;
}

function updateDisplay() {
	if (!modifyingTeam) return;
	document.getElementById("teamManagerSelectLogoDisplay").src = modifyingTeam.logo || "";
	let obj = document.getElementById("teamManagerSelectLogo");
	let index = [...document.getElementById("teamManagerSelectLogo").options].findIndex(option =>
		option.getAttribute("data-image-url") === modifyingTeam.logo
	);
	obj.selectedIndex = index;

	document.getElementById("teamManagerSelectRosterLogoDisplay").src = modifyingTeam.rosterLogo || "";
	obj = document.getElementById("teamManagerSelectRosterLogo");
	index = [...document.getElementById("teamManagerSelectRosterLogo").options].findIndex(option =>
		option.getAttribute("data-image-url") === modifyingTeam.rosterLogo
	);
	obj.selectedIndex = index;

	if (!modifyingTeam.colors)
		modifyingTeam.colors = { teamColor: "#ffffff", playerColor: "#A4F0CA" }
	if (!modifyingTeam.colors.borderColor) modifyingTeam.colors.borderColor = "#FFFFFF";

	$("#teamColor").val(modifyingTeam.colors.teamColor);
	$("#playerColor").val(modifyingTeam.colors.playerColor);
	$("#borderColor").val(modifyingTeam.colors.borderColor);
	$("#updateTeamName").val(modifyingTeam.name);

	$("#updateTeamName").prop("disabled", false);
	$("#teamManagerSelectLogoDisplay").prop("disabled", false);
	$("#teamManagerSelectLogo").prop("disabled", false);
	$("#teamManagerSelectRosterLogoDisplay").prop("disabled", false);
	$("#teamManagerSelectRosterLogo").prop("disabled", false);
	$("#saveTeamButton").prop("disabled", false);
	$("#teamColor").prop("disabled", false);
	$("#playerColor").prop("disabled", false);
	$("#borderColor").prop("disabled", false);

	for (let playerId = 1; playerId < 7; playerId++) {
		// console.log(playerId);
		$("#rosterPlayer" + playerId).prop("disabled", false);
		$("#player" + playerId + "hero").prop("disabled", false);
		$("#player" + playerId + "role").prop("disabled", false);
		$("#rosterPlayer" + playerId + "Quote").prop("disabled", false);


		const player = modifyingTeam.roster[playerId - 1];
		if (player) {

			const playerHero = document.getElementById("player" + playerId + "hero");
			const playerHeroIndex = [...document.getElementById("player" + playerId + "hero").options].findIndex(option =>
				option.getAttribute("data-hero") === player.hero
			);
			playerHero.selectedIndex = playerHeroIndex;

			$("#rosterPlayer" + playerId).val(player.name);
			$("#player" + playerId + "role").val(player.role);
			$("#rosterPlayer" + playerId + "Quote").val(player.quote || "");
		}
	}

}

teamLogos.on("change", (logoList) => {
	// console.log("Loaded Team Logos", logoList);

	/* Remove all options from the select list */
	$("#teamManagerSelectLogo").empty();
	$("#teamManagerSelectRosterLogo").empty();

	var nonSelect = document.createElement("option");
	// console.log("Image Data", image);
	nonSelect.text = "None";
	nonSelect.id = "None";
	nonSelect.setAttribute("data-image-url", "");

	$("#teamManagerSelectLogo").append($(nonSelect).clone());
	$("#teamManagerSelectRosterLogo").append($(nonSelect).clone());

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
