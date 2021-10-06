let maps = null;

const matchConfiguration = nodecg.Replicant("matchConfiguration", {
    defaultValue: {
        matchTitle: "SET ME",
        casters: ["Caster 1", "Caster 2"],
    },
});

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


let selectedMaps = [
    { map: "Lijiang Tower", draw: false, winner: 0, team1score: 2, team2score: 1 },
    { map: "King's Row", draw: true, winner: null, team1score: 6, team2score: 6 },
    { map: "Rialto", draw: false, winner: 1, team1score: 0, team2score: 3 },
    { map: "Hanamura", draw: false, winner: 0, team1score: 2, team2score: 1 },
    { map: "Nepal", draw: false, winner: 1, team1score: 1, team2score: 2 },
    { map: "Gamemode: Control", draw: false, winner: null, team1score: 1, team2score: 1 }
];
// let selectedMaps = [
//     { map: "Gamemode: Control", mapNote: "Map 1", draw: false, winner: null, team1score: 0, team2score: 0 },
//     { map: "Gamemode: Hybrid", mapNote: "Map 2", draw: false, winner: null, team1score: 0, team2score: 0 },
//     { map: "Gamemode: Escort", mapNote: "Map 3", draw: false, winner: null, team1score: 0, team2score: 0 },
//     { map: "Gamemode: Assault", mapNote: "Map 4", draw: false, winner: null, team1score: 0, team2score: 0 },
//     { map: "Gamemode: Control", mapNote: "Map 5", draw: false, winner: null, team1score: 0, team2score: 0 },
//     { map: "Gamemode: Control", mapNote: "Tie Breaker", draw: false, winner: null, team1score: 0, team2score: 0 }
// ];


function findMap(mapName) {
    return maps.allmaps.filter((map) => map.name == mapName)[0]
}

themeCallback = async () => {
    loadColors("mapView");
    loadCustomCSS("mapCSS");
    if (teamsLoaded && themeLoaded)
        await updateMaps(true);
}

teamsCallback = async () => {
    if (teamsLoaded && themeLoaded)
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

        const mapData = selectedMaps[i];
        let node4 = $(".mapinfo" + (i + 1) + " .maptype");
        let node5 = $(".mapwrap" + (i + 1) + ", .mapinfo" + (i + 1));
        if (!mapData) {
            node5.css("display", "none");
            continue
        }
        const actualMapData = findMap(mapData.map);
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
    mapCache = selectedMaps;
    if (first)
        $(".LOADING").removeClass("LOADING");
}