let maps = null;

let cachedConfig = {
    matchTitle: "SET ME",
    casters: ["Caster 1", "Caster 2"],
};
$.ajax({
    url: "../assets/data/maps.json",
    success: function (data) {
        maps = data;
    },
});



function findMap(mapName) {
    return maps.allmaps.filter((map) => map.name == mapName)[0]
}

currentMatchCallback = async () => {
    if (!loadedMatch) return;
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

    if (teamsLoaded && themeLoaded && loadedMatch)
        await updateMaps(true);
}

themeCallback = async () => {
    loadColors("mapView");
    loadCustomCSS("mapCSS");
    if (teamsLoaded && themeLoaded && loadedMatch)
        await updateMaps(true);
}

teamsCallback = async () => {
    if (teamsLoaded && themeLoaded && loadedMatch)
        await updateMaps(true);
}

matchConfiguration.on("change", (newMatch) => {
    $("div.scoreboard span").html(newMatch.matchTitle);
})

let mapCache;

async function updateMaps(first) {
    if (!maps) return setTimeout(updateMaps(first), 100);
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
        let img = "../assets/maps/" + actualMapData.file;
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
                $('.mapbg' + (i + 1) + ' .mapscore span').css("color", (mapWinner.colors.playerColor));
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
    if (first)
        $(".LOADING").removeClass("LOADING");
}