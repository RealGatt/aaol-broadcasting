useTheme();
useTeam();

waitForLoad(() => {
	updateMatchNumber();
	updateGraphics();
	nodecg.sendMessage("showScoreboard", true);
})



matchConfigUpdateCallback = () => {
	console.log(`Loaded match`, cachedMatchConfiguration);
	if (!cachedMatchConfiguration.rolesDisplayed) {
		$("#team1side").hide();
		$("#team2side").hide();
	} else {
		const team1role = cachedMatchConfiguration.leftRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		const team2role = cachedMatchConfiguration.rightRole == "Attack" ? cachedThemeObj.assets.attackIcon : cachedThemeObj.assets.defenseIcon;
		$("#team1side").hide();
		$("#team2side").hide();
		$("#team1side span").css("background-image", `url(${team1role})`);
		$("#team2side span").css("background-image", `url(${team2role})`);
		$("#team1side").show();
		$("#team2side").show();
	}
	updateGraphics();
	updateMatchNumber();
}

themeCallback = () => {
	loadColors("scoreOverlay");
	loadCustomCSS("scoreOverlayCSS");
	updateGraphics();
}

teamsCallback = () => {
	updateGraphics();
}

currentMatchCallback = () => {
	updateMatchNumber();
	updateGraphics();
}

function updateMatchNumber() {
	if (!loaded) return;
	console.log(`Updating match number`);
	let allmaps = cachedMatchConfiguration.mapTitle || "FT3";
	let gametype = null;
	if (allmaps.match(/bo/gi) != null || allmaps.match(/best of/gi) != null) {
		gametype = "bo"
		allmaps = (allmaps).replace(/\n/gi, "").replace(/\r/gi, "").replace(/bo/gi, "").replace(/best of/gi, "")
		allmaps = parseInt(allmaps, 10)
	} else if (allmaps.match(/ft/gi) != null || allmaps.match(/first to/gi) != null) {
		gametype = "ft"
		allmaps = (allmaps).replace(/\n/gi, "").replace(/\r/gi, "").replace(/ft/gi, "").replace(/first to/gi, "")
		allmaps = parseInt(allmaps, 10)
	}

	// Get map count
	let totalmap = 0;
	let completedmap = 0;
	for (let i = 0; i < 7; ++i) {
		const mapData = loadedMatch.maps[i];
		if (mapData.winner !== null || mapData.draw) {
			completedmap++;
		}
		totalmap++;
	}
	console.log(`total v complete`, totalmap, completedmap)
	if (completedmap >= totalmap) {
		$('.center .teamname').html("<b>Final</b> Score");
	} else {
		if (allmaps <= completedmap && gametype == "bo") {
			$('.center .teamname').html("<b>Tiebreaker </b>Map");
		} else {
			if (gametype == "bo") {
				$('.center .teamname').html("Map <b>" + (completedmap + 1) + "</b> of <b>" + (allmaps) + "</b>");
			} else if (gametype == "ft") {
				$('.center .teamname').html("Map <b>" + (completedmap + 1) + "</b> - First to <b>" + (allmaps) + "</b>");
			} else {
				$('.center .teamname').html("Map <b>" + (completedmap + 1) + "</b>");
			}
		}
	}
}

function updateGraphics() {
	if (!loaded) return;

	console.log("Matches", cachedMatchList);
	if (!(loadedMatch !== undefined && cachedTeamList && cachedMatchList)) {
		console.log("Can't update graphics. Waiting on Cache Data", loadedMatch, cachedTeamList, cachedMatchList);
		return false;
	}
	setTimeout(async function () {
		console.log(loadedMatch);
		const team1obj = getTeamById(loadedMatch.team1);
		const team2obj = getTeamById(loadedMatch.team2);

		$("#teamColors").html(`:root {
			--team1TeamColor: 	${cachedTeamList[loadedMatch.team1].colors.teamColor || "var(--LEFT-TEAM)"} !important;
			--team2TeamColor: 	${cachedTeamList[loadedMatch.team2].colors.teamColor || "var(--LEFT-TEAM)"} !important;
			--team1BorderColor: ${cachedMatchConfiguration.useTeamBorders ? cachedTeamList[loadedMatch.team1].colors.borderColor : "var(--LEFT-TEAM)"} !important;
			--team2BorderColor: ${cachedMatchConfiguration.useTeamBorders ? cachedTeamList[loadedMatch.team2].colors.borderColor : "var(--RIGHT-TEAM)"} !important;
			--team1PlayerColor: ${cachedTeamList[loadedMatch.team1].colors.playerColor || "var(--LEFT-TEAM)"} !important;
			--team2PlayerColor: ${cachedTeamList[loadedMatch.team2].colors.playerColor || "var(--LEFT-TEAM)"} !important;
		}`);
		$("#team1name").html(team1obj.name);
		$("#team2name").html(team2obj.name);
		$("#team1score").html(loadedMatch.team1score);
		$("#team2score").html(loadedMatch.team2score);

		if (!cachedThemeObj.assets.scoreOverlayTeamLeftBottomBorderToggle)
			$("div.left").get(0).style.setProperty("--team1BottomBorderColor", "0px solid transparent");
		else
			$("div.left").get(0).style.setProperty("--team1BottomBorderColor", "var(--team1BorderColor)");

		if (!cachedThemeObj.assets.scoreOverlayTeamRightBottomBorderToggle)
			$("div.right").get(0).style.setProperty("--team2BottomBorderColor", "0px solid transparent");
		else
			$("div.right").get(0).style.setProperty("--team2BottomBorderColor", "var(--team2BorderColor)");


		if (team1obj.logo) {
			$(".team1 .logo").get(0).style.setProperty("--teamLogo", `url(${team1obj.logo})`);
			$('div.left span.teamname').css("right", "200px");
			$('div.left span.teamsr').css("right", "210px");
			$('.team1 .logo').css("display", "inherit");
			$('.team1 .logoshade').css("display", "inherit");
		} else {
			$('div.left span.teamname').css("right", "80px");
			$('div.left span.teamsr').css("right", "90px");
			$('.team1 .logo').css("display", "none");
			$('.team1 .logoshade').css("display", "none");
		}
		if (team2obj.logo) {
			$(".team2 .logo").get(0).style.setProperty("--teamLogo", `url(${team2obj.logo})`);
			$('div.right span.teamname').css("left", "200px");
			$('div.right span.teamsr').css("left", "210px");
			$('.team2 .logo').css("display", "inherit");
			$('.team2 .logoshade').css("display", "inherit");
		} else {
			$('div.right span.teamname').css("left", "80px");
			$('div.right span.teamsr').css("left", "90px");
			$('.team2 .logo').css("display", "none");
			$('.team2 .logoshade').css("display", "none");
		}
	}, 100);
}

nodecg.listenFor('showScoreboard', (shown) => {
	console.log("showScoreboard", shown);
	if (shown) {
		$(".hidden").each(async function (id, e) {
			$(e).removeClass("hidden");
			$(e).addClass("not-hidden");
		})
	} else {
		$(".not-hidden").each(async function (id, e) {
			$(e).addClass("slideTop");
			setTimeout(() => {
				$(e).removeClass("not-hidden");
				$(e).addClass("hidden");
				$(e).removeClass("slideTop");
			}, 2200)
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