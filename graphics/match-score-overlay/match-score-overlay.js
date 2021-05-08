const teamList = nodecg.Replicant("teamList");
const matches = nodecg.Replicant("matchList");
const currentMatch = nodecg.Replicant("currentMatch");
const themes = nodecg.Replicant("themes");
const currentTheme = nodecg.Replicant("currentTheme");
const matchConfiguration = nodecg.Replicant("matchConfiguration");

let cachedTeamList;
let cachedMatchList;
let cachedCurrentMatch;
let cachedThemeObj;
let cachedThemes;
let cachedThemeId;

themes.on("change", (themes) => {
	cachedThemes = themes;
	updateTheme();
})

currentTheme.on("change", (themeId) => {
	cachedThemeId = themeId;
	updateTheme();
})


teamList.on("change", (teamList) => {
	console.log("Teamlist has been updated", teamList);
	cachedTeamList = teamList;
	updateGraphics();
});

matches.on("change", (matches) => {
	console.log("Matches has been updated", matches);
	cachedMatchList = matches;
	updateGraphics();
});

currentMatch.on("change", (newMatch) => {
	console.log("Current match has been updated", newMatch);
	cachedCurrentMatch = newMatch;
	updateGraphics();
});

matchConfiguration.on("change", (newConfig) => {
	$("#matchTitleDiv").html(newConfig.matchTitle);
	$("#caster1").html(newConfig.casters[0]);
	$("#caster2").html(newConfig.casters[1]);
	if (!newConfig.rolesDisplayed) {
		$("#team1role").hide();
		$("#team2role").hide();
	} else {
		const team1role = newConfig.leftRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		const team2role = newConfig.rightRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		$("#team1role").hide();
		$("#team2role").hide();
		$("#team1role").attr("src", `${team1role}`);
		$("#team2role").attr("src", `${team2role}`);
		$("#team1role").show();
		$("#team2role").show();
	}
})

function updateTheme() {
	console.log("Theme Stuff", cachedThemeId, cachedThemes);
	if (cachedThemeId === undefined || !cachedThemes) {
		console.log("Can't update theme, something is undefined", cachedThemeId, cachedThemes);
		return;
	}
	console.log("Updating Theme");
	cachedThemeObj = cachedThemes[cachedThemeId];
	// console.log(cachedThemeObj);
	// $("#team1").css('background-image', `url(${cachedThemeObj.assets.teamLeftImage})`);
	// $("#team2").css('background-image', `url(${cachedThemeObj.assets.teamRightImage})`);
	$("#team1Background").attr("src", cachedThemeObj.assets.teamLeftImage);
	$("#team2Background").attr("src", cachedThemeObj.assets.teamRightImage);
	$("#matchTitleBackground").attr("src", cachedThemeObj.assets.mapBackground);
	$("#castersBackground").attr("src", cachedThemeObj.assets.castersNamesBackground);
}

function updateGraphics() {
	console.log("Matches", cachedMatchList);
	if (!(cachedCurrentMatch !== undefined && cachedTeamList && cachedMatchList)) {
		console.log("Can't update graphics. Waiting on Cache Data", cachedCurrentMatch, cachedTeamList, cachedMatchList);
		return false;
	}
	setTimeout(async function () {
		const match = cachedMatchList[cachedCurrentMatch];
		console.log(match);
		const team1obj = cachedTeamList[match.team1];
		const team2obj = cachedTeamList[match.team2];

		$("#team1name").html(team1obj.name);
		$("#team2name").html(team2obj.name);
		$("#team1score").html(match.team1score);
		$("#team2score").html(match.team2score);
		$("#team1logo").attr("src", team1obj.logo);
		$("#team2logo").attr("src", team2obj.logo);

	}, 100);
}

nodecg.listenFor('showScoreboard', (shown) => {
	console.log("showScoreboard", shown);
	if (shown){
		$(".hidden").each(async function (id, e) {
			$(e).removeClass("hidden");
			$(e).addClass("not-hidden");
		})
	}else{
		$(".not-hidden").each(async function (id, e) {
			$(e).removeClass("not-hidden");
			$(e).addClass("hidden");
		})
	}
});
nodecg.listenFor('showCasters', (shown) => {
	if (shown){
		$(".hiddenCasters").each(async function (id, e) {
			$(e).removeClass("hiddenCasters");
			$(e).addClass("not-hiddenCasters");
		})
	}else{
		$(".not-hiddenCasters").each(async function (id, e) {
			$(e).removeClass("not-hiddenCasters");
			$(e).addClass("hiddenCasters");
		})
	}
});