themeCallback = () => {
	console.log(cachedThemeObj);
	loadColors("scoreOverlay");
	loadCustomCSS("scoreOverlayCSS");
	nodecg.sendMessage("showScoreboard", true);
}

matchConfigUpdateCallback = () => {
	console.log(`Loaded match`, cachedMatchConfiguration);
	$("#matchtext").html(cachedMatchConfiguration.matchTitle);
	$("#caster1").html(cachedMatchConfiguration.casters[0]);
	$("#caster2").html(cachedMatchConfiguration.casters[1]);
	if (!cachedMatchConfiguration.rolesDisplayed) {
		$("#team1role").hide();
		$("#team2role").hide();
	} else {
		const team1role = cachedMatchConfiguration.leftRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		const team2role = cachedMatchConfiguration.rightRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		$("#team1role").hide();
		$("#team2role").hide();
		$("#team1side span").css("background-image", `url(${team1role})`);
		$("#team2side span").css("background-image", `url(${team2role})`);
		$("#team1role").show();
		$("#team2role").show();
	}
	updateGraphics();
}

currentMatchCallback = () => {
	updateGraphics();
}

function updateGraphics() {
	console.log("Matches", cachedMatchList);
	if (!(loadedMatch !== undefined && cachedTeamList && cachedMatchList)) {
		console.log("Can't update graphics. Waiting on Cache Data", loadedMatch, cachedTeamList, cachedMatchList);
		return false;
	}
	setTimeout(async function () {
		console.log(loadedMatch);
		const team1obj = cachedTeamList[loadedMatch.team1];
		const team2obj = cachedTeamList[loadedMatch.team2];

		$("#team1name").html(team1obj.name);
		$("#team2name").html(team2obj.name);
		$("#team1score").html(loadedMatch.team1score);
		$("#team2score").html(loadedMatch.team2score);
		if (team1obj.logo) {
			$(".team1 .logo").css("background-image", `url(${team1obj.logo})`);
			$('div.left span.teamname').css("right", "200px");
			$('div.left span.teamsr').css("right", "210px");
            $('.team1 .logo').css("display", "inherit");
            $('.team1 .logoshade').css("display", "inherit");
		}else{
			$('div.left span.teamname').css("right", "80px");
			$('div.left span.teamsr').css("right", "90px");
            $('.team1 .logo').css("display", "none");
            $('.team1 .logoshade').css("display", "none");
		}
		if (team2obj.logo) {
			$(".team2 .logo").css("background-image", `url(${team2obj.logo})`);
			$('div.right span.teamname').css("left", "200px");
			$('div.right span.teamsr').css("left", "210px");
            $('.team2 .logo').css("display", "inherit");
            $('.team2 .logoshade').css("display", "inherit");
		}else{
			$('div.right span.teamname').css("left", "80px");
			$('div.right span.teamsr').css("left", "90px");
            $('.team2 .logo').css("display", "none");
            $('.team2 .logoshade').css("display", "none");
		}

	}, 100);
}


nodecg.listenFor("leftTeam", (shown) => { })
nodecg.listenFor("rightTeam", (shown) => { })

nodecg.listenFor('showScoreboard', (shown) => {
	console.log("showScoreboard", shown);
	if (shown) {
		$(".hidden").each(async function (id, e) {
			$(e).removeClass("hidden");
			$(e).addClass("not-hidden");
		})
	} else {
		$(".not-hidden").each(async function (id, e) {
			$(e).removeClass("not-hidden");
			$(e).addClass("hidden");
		})
	}
});
nodecg.listenFor('showCasters', (shown) => {
	if (shown) {
		$(".hiddenCasters").each(async function (id, e) {
			$(e).removeClass("hiddenCasters");
			$(e).addClass("not-hiddenCasters");
		})
	} else {
		$(".not-hiddenCasters").each(async function (id, e) {
			$(e).removeClass("not-hiddenCasters");
			$(e).addClass("hiddenCasters");
		})
	}
});