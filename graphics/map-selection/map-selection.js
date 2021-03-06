useMaps();
useTheme();
useTeam();

waitForLoad(() => {
    loadColors("mapView");
    updateMaps(true);
})

let cachedConfig = {
    matchTitle: "SET ME",
    casters: ["Caster 1", "Caster 2"],
};

anyUpdateCallback = async () => {
    if (!loadedMatch || !loaded) return;
    console.log(`Match`, loadedMatch, cachedMatchList[currentMatch]);
    if (!loadedMatch.maps) {
        // default AAOL Map pool order
        loadedMatch.maps = [{ map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "Hybrid", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "Escort", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "Assault", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "Control", team1score: 0, team2score: 0, done: false, winner: null, draw: false },
        { map: "None", team1score: 0, team2score: 0, done: false, winner: null, draw: false }];
    }
    console.log(`Updated the map pool`)
    await updateMaps(false);
}

let mapCache;


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
    if (gametype == "bo") {
        $('.scoreboard span').html("<b>Best</b> of <b>" + (allmaps) + "</b>");
    } else if (gametype == "ft") {
        $('.scoreboard span').html("<b>First</b> to <b>" + (allmaps) + "</b>");
    } else {
        $('.scoreboard span').html("<b>First</b> to <b>" + (allmaps) + "</b>");
    }
}

async function updateMaps(first) {
    if (!maps) return;
    let theincomplete = 0;
    let totalmap = 0;
    for (let i = 0; i < 7; ++i) {

        const mapData = loadedMatch.maps[i];
        let node4 = $(".mapinfo" + (i + 1) + " .maptype");
        let node5 = $(".mapwrap" + (i + 1) + ", .mapinfo" + (i + 1));
        if (!mapData) {
            node5.css("display", "none");
            continue
        }
        const actualMapData = findMap(mapData.map);
        if (!actualMapData) {
            node5.css("display", "none");
            continue
        }
        console.log(actualMapData);
        const mapWinner = mapData.winner !== null ? getTeamById(mapData.winner) : null;

        node5.css("display", "block");
        totalmap = totalmap + 1;

        //Get the map type details
        let mapgametypetxt = mapData.mapNote ? mapData.mapNote : actualMapData.gamemode || "";
        let check = (mapgametypetxt).replace(/\n|\r/gi, "");
        let unformat = (mapgametypetxt);
        if (check != "") {
            node5.css("display", "block");
            totalmap = totalmap + 1;
        } else {
            node5.css("display", "none");
        }
        node4.text(unformat);

        //Get the map name details
        let maptxt = actualMapData.displayedName || actualMapData.name;
        if ((maptxt).replace(/\\/gi, "/").replace(/\"/gi, "\\\"") == "") {
            reptext = "TBA";
        } else {
            reptext = (maptxt)
        }
        let img = "../../assets/maps/" + actualMapData.file;
        //let reptext = (maptxt).replace("?", "TBA");
        let node1 = $(".mapbg" + (i + 1) + " img");
        let node2 = $(".mapinfo" + (i + 1) + " .mapname");
        if (node1.attr("src") != img) {
            node1.attr("src", img);
            node2.text(reptext);
        }

        //Determine and colour each map winner
        let mapwintxt = mapWinner ? mapWinner.name : "";
        let mt1scoretxt = mapData.team1score;
        let mt2scoretxt = mapData.team2score;

        let regex = "";
        [
            "gaming", "team", "e-?sports", "house", "academy", "uni(versity)?", "state", "tech", "and", "the", "of", "eu",
        ].forEach((value) => {
            regex += "|(" + value + ")";
        });
        regex = "\\b(" + regex.substring(1) + ")\\b";

        let teamformatted = "<div><b>" + mapwintxt.replace(
            new RegExp(regex, "gi"), "</b>$1<b>")
            .replace(/&/gi, "</b>&<b>") + "</b></div>";
        $('.mapbg' + (i + 1) + ' .mapscore .teamname').html(teamformatted);

        if (mapData.draw || mapWinner) {
            if (mapData.draw) {
                $('.mapbg' + (i + 1)).css("background-color", `var(--mapViewDrawMapBackgroundColor)`);
                $('.mapbg' + (i + 1) + ' .mapscore .score').html((mt1scoretxt) + "-" + (mt2scoretxt));
                $('.mapbg' + (i + 1) + ' .mapscore span').css("color", "var(--mapViewDrawMapTextColor)");
                $('.mapbg' + (i + 1) + ' .mapscore .teamname').html("DRAW");
            } else {
                $('.mapbg' + (i + 1) + ' img').css("filter", "greyscale(100%)");
                $('.mapbg' + (i + 1) + ' img').css("mix-blend-mode", "luminosity");
                document.querySelector(".mapbg" + (i + 1) + " .mapscore .logo").style.backgroundImage = "url(" + mapWinner.logo + ")";
                $('.mapbg' + (i + 1)).css("background-color", (mapWinner.colors.teamColor));
                $('.mapbg' + (i + 1) + ' .mapscore span').css("color", (mapWinner.colors.borderColor));
                $('.mapbg' + (i + 1) + ' .mapscore .score').html((mt1scoretxt) + "-" + (mt2scoretxt) + "");
            }
        } else if (theincomplete > 0) { // for other incomplete maps
            theincomplete = theincomplete + 1;
            $('.mapbg' + (i + 1) + ' img').css("filter", "greyscale(0%)");
            $('.mapbg' + (i + 1) + ' img, .mapbg' + (i + 1) + ' video').css("opacity", "0.33");
            $('.mapbg' + (i + 1) + ' img').css("mix-blend-mode", "normal");
            $('.mapbg' + (i + 1)).css("background-color", `var(--mapViewIncompleteMapBackgroundColor)`);
            $('.mapbg' + (i + 1) + ' .mapscore .score').html("");
            $('.mapbg' + (i + 1) + ' .mapscore span').css("color", "white");
            document.querySelector(".mapbg" + (i + 1) + " .mapscore .logo").style.backgroundImage = "url(data:image/jpeg;base64,)";
        } else if (theincomplete == 0) { // Check to see if it's the first incomplete map
            theincomplete = theincomplete + 1;

            $('.mapbg' + (i + 1) + ' img').css("filter", "greyscale(0%)");
            $('.mapbg' + (i + 1) + ' img, .mapbg' + (i + 1) + ' video').css("opacity", "1");
            $('.mapbg' + (i + 1) + ' img').css("mix-blend-mode", "normal");
            $('.mapbg' + (i + 1)).css("background-color", `var(--INCOMPLETE-MAP-BACKGROUND)`);
            $('.mapbg' + (i + 1) + ' .mapscore span').css("color", "white");
            if ((mt1scoretxt) == 0 && (mt2scoretxt) == 0) {
                $('.mapbg' + (i + 1) + ' .mapscore .score').html("");
            } else {
                $('.mapbg' + (i + 1) + ' .mapscore .score').html((mt1scoretxt) + "-" + (mt2scoretxt));
            }

            $('.mapbg' + (i + 1) + ' img').css("display", "block");
            $('.mapbg' + (i + 1) + ' video').css("display", "none");

            document.querySelector(".mapbg" + (i + 1) + " .mapscore .logo").style.backgroundImage = "url(data:image/jpeg;base64,)";
        }


        //End the loop
    }
    updateMatchNumber();
    sceneLoaded = true;
    if (first)
        $(".LOADING").removeClass("LOADING");
}