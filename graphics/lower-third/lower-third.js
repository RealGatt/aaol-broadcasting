useTheme();
useTeam();
useMaps();
anyUpdateCallback = () => {
	if (loaded) updateDisplay();
};
waitForLoad(async () => {
	for (let map = 1; map < 8; map++) {
		hideMap(map);
	}

	loadColors("lowerThird");
	await updateDisplay().then(() => {
		setTimeout(() => {
			$(".wrapper").show();
		}, 500);
	});
});

async function updateDisplay() {
	const team1 = getTeamById(loadedMatch.team1);
	const team2 = getTeamById(loadedMatch.team2);

	$(`#matchName`).html(cachedMatchConfiguration.matchTitle);
	$(`.team1 > .teamName > .teamName`).html(team1.name);
	$(`.team2 > .teamName > .teamName`).html(team2.name);
	$(`#team1score`).html(loadedMatch.team1score);
	$(`#team2score`).html(loadedMatch.team2score);
	if (team1.logo) {
		$(`.team1 > .teamName > .teamLogo`)
			.get(0)
			.style.setProperty("--teamLogo", `url(${team1.logo})`);
		$(`.team1 > .teamName > .teamLogo`).show();
	} else $(`.team1 > .teamName > .teamLogo`).hide();
	if (team2.logo) {
		$(`.team2 > .teamName > .teamLogo`)
			.get(0)
			.style.setProperty("--teamLogo", `url(${team2.logo})`);
		$(`.team2 > .teamName > .teamLogo`).show();
	} else $(`.team2 > .teamName > .teamLogo`).hide();

	["Control", "Hybrid", "Assault", "Escort", "EscortHybrid"].forEach(
		(val) => {
			$(`.${val}`).removeClass(val);
		}
	);
	for (let map = 0; map < 7; map++) {
		if (loadedMatch.maps[map]) {
			const mapD = loadedMatch.maps[map];
			if (mapD.map != "None") {
				const mapInfo = findMap(mapD.map);
				console.log(mapInfo, mapD);
				$(`#map${map + 1}display`).addClass(
					mapInfo.gamemode == "Upcoming" ? mapD.map : mapInfo.gamemode
				);
				if (mapD.team1score == 0 && mapD.team2score == 0) {
					$(`#team1map${map + 1}`).html("-");
					$(`#team2map${map + 1}`).html("-");
				} else {
					$(`#team1map${map + 1}`).html(mapD.team1score);
					$(`#team2map${map + 1}`).html(mapD.team2score);
				}
				if (mapD.done) {
					$(`#team1map${map + 1}`).addClass("mapDone");
					$(`#team2map${map + 1}`).addClass("mapDone");
				}
				showMap(map + 1);
			} else {
				hideMap(map + 1);
			}
		}
	}

	return true;
}

function hideLowerMaps() {
	$("th, td, thead, tr").removeClass("show");
	setTimeout(() => {
		$("#mapThird").hide();
	}, 1700);
}

function showLowerMaps() {
	$("th, td, thead, tr").addClass("show");
	$("#mapThird").show();
}

function hideMap(map) {
	$(`.map${map}`).hide();
}
function showMap(map) {
	$(`.map${map}`).show();
}

function hideLowerInfo() {
	$("#casterWrapper").removeClass("show");
	setTimeout(() => {
		$("#casterWrapper").hide();
	}, 1000);
}

function showLowerInfo() {
	$("#casterWrapper").addClass("show");
	$("#casterWrapper").show();
}

nodecg.listenFor("showMapLower", (shown) => {
	if (shown) {
		showLowerMaps();
	} else {
		hideLowerMaps();
	}
});
