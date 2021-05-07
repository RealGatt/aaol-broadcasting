const rosters = nodecg.Replicant("roster", {
	defaultValue: [{
		teamId: 2,
		player1: {
			role: "Flex",
			hero: "Winston",
			name: "Nbow",
			playerIcon: "https://cdn.discordapp.com/avatars/438998306476261377/0ba7ce8e33bb5adf24d718d717a4b108.png?size=256",
			extraDetails: "/Nbow"
		},
		player2: {
			role: "Tank",
			hero: "Wrecking Ball",
			name: "Bean",
			playerIcon: "https://cdn.discordapp.com/avatars/273295692280102912/284a499eda953f9380b656ab43dc4420.png?size=256",
			extraDetails: "/Cool"
		},
		player3: {
			role: "DPS",
			hero: "Widowmaker",
			name: "Artemis",
			playerIcon: "https://cdn.discordapp.com/avatars/342069018556891138/80e3a361ded4f9b3cbb4f6e2d508f2f8.png?size=256",
			extraDetails: "/KaijammoOW"
		},
		player4: {
			role: "DPS",
			hero: "Junkrat",
			name: "Ded",
			playerIcon: "https://cdn.discordapp.com/avatars/244297063729332224/c1a34ac2601c3259ad3fbcd93273df01.png?size=256",
			extraDetails: "/ProfoundRice"
		},
		player5: {
			role: "Flex",
			hero: "Mercy",
			name: "Shinonmi",
			playerIcon: "https://cdn.discordapp.com/avatars/175978126784987136/a7c37a8e6de4e0abc43c481a38e3361d.png?size=256",
			extraDetails: "/SarahJane"
		},
		player6: {
			role: "Support",
			hero: "Lucio",
			name: "GamingPanda",
			playerIcon: "https://cdn.discordapp.com/avatars/238836105095544832/364b329453b2cc8b60e87564fe7e244d.png?size=256",
			extraDetails: "/Frogger"
		}
	}, {
		teamId: 1,
		player1: {
			role: "Tank",
			hero: "Reinhardt",
			name: "Goose"
		},
		player2: {
			role: "Tank",
			hero: "Zarya",
			name: "Doggo"
		},
		player3: {
			role: "DPS",
			hero: "Genji",
			name: "Gatt"
		},
		player4: {
			role: "Flex",
			hero: "Tracer",
			name: "Sweat"
		},
		player5: {
			role: "Support",
			hero: "Mercy",
			name: "eggswithlegs"
		},
		player6: {
			role: "Support",
			hero: "Moira",
			name: "Bees"
		}
	}]
});

const teamData = nodecg.Replicant("teamList");
const teamLogos = nodecg.Replicant("assets:teamlogos");

let cachedRoster;
let cachedTeams;

rosters.on("change", (newRoster) => {
	cachedRoster = newRoster
});

teamData.on("change", (newTeams)=>{
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

function getClassForHero(hero){
	let heroToAdd = heroData.heroes.filter((heroObj) => {
		return heroObj.name === hero;
	})[0];
	let classToAdd = heroToAdd.name;
	if (heroToAdd.classOverride)
		classToAdd = heroToAdd.classOverride;

	return classToAdd;
}

function setDisplayedRoster(team){
	let rosterData = cachedRoster.filter((roster) => {
		return roster.teamId === team;
	})[0];
	Object.keys(rosterData).forEach((playerId) => {
		if (playerId !== "teamId") {
			// clear the current classes
			heroes.forEach((hero) => {
				$("#" + playerId + " > .rosterDisplay > .heroDisplay").removeClass(getClassForHero(hero));
			});

			const hero = rosterData[playerId].hero;
			const classToAdd = getClassForHero(hero);
			
			$("#" + playerId + " > .playerIcon").attr('src', rosterData[playerId].playerIcon || null);
			$("#" + playerId + " > .rosterDisplay > .heroDisplay > .namePlate > .roleIcon").removeClass(["Tank", "DPS", "Support", "Flex"]);
			$("#" + playerId + " > .rosterDisplay > .heroDisplay > .namePlate > .roleIcon").addClass(rosterData[playerId].role);
			$("#" + playerId + " > .rosterDisplay > .heroDisplay > .namePlate > .rosterName").html(`${rosterData[playerId].name}${rosterData[playerId].extraDetails !== undefined ? "<br>" + rosterData[playerId].extraDetails : ""}`);
			$("#" + playerId + " > .rosterDisplay > .heroDisplay").addClass(classToAdd);
		}
	});

	const teamObj = cachedTeams[team];
	$(".teamName").html(teamObj.name);
	$(".teamInformation > img").attr('src', teamObj.logo);
}

function displayRoster(team) {
	hideRoster();
	setTimeout(function(){
		setDisplayedRoster(team);
		showRoster();
	}, 2000);
	
}

function hideRoster(){
	$(".playerDisplay").addClass("offscreen");
	$(".teamInformation").addClass("offscreen");
}

function showRoster(){
	$(".offscreen").removeClass("offscreen");
	$(".teamInformation").removeClass("offscreen");
}

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