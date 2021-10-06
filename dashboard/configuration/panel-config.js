let currentTheme = nodecg.Replicant("currentTheme", {
	defaultValue: -1
});
const themes = nodecg.Replicant("themes", {
	defaultValue: []
});
const themeAssets = nodecg.Replicant("assets:theme");

let cachedThemes = [];
let cachedCurrentTheme = -1;
let modifyingTheme = undefined,
	modifyingThemeId = -1;
let themeAssetsCache = null;

themeAssets.on("change", (assetList) => {
	themeAssetsCache = assetList;
	updateAssets();

});

themes.on("change", (themes) => {
	cachedThemes = themes;
	updateThemeList();
});

currentTheme.on("change", (currentTheme) => {
	updateThemeList();
});

function updateThemeList() {
	if (!currentTheme) return;
	$("#selectTheme").empty();
	console.log("THEMES", cachedThemes);

	/* Insert the new ones from the array above */
	$.each(cachedThemes, function (value) {
		var ele = document.createElement("option");
		const theme = cachedThemes[value];
		if (currentTheme.value == value)
			ele.text = theme.name + " (Current)";
		else
			ele.text = theme.name;
		ele.id = value;
		$("#selectTheme").append(ele);
	});
}

const typeTemplates = {
	css: `<label for="%id%" class="form-label">%title%</label><br>
	<textarea id="%id%" class="form-label cssInput" cols="75" rows="10" />`,
	imageAsset: `<label for="%id%" class="form-label">%title%</label>
	<select
		class="form-select assetDisplay"
		name="%id%"
		id="%id%"
	></select>
	<img id="%id%-imageDisplay" class="form-control imageDisplay"></img>`,
	color: `
	<label for="%id%" class="form-label">%title%</label>
	<div class="input-group mb-3">
	<input
		type="color"
		class="form-control"
		id="%id%"
		title="%title%"
		data-group="%id%"
		style="max-width: 64px; height: 32px;"
		oninput="updateColor('%id%');"
	/>
	<input 
	class="form-control"
	id="%id%-transparency"
	data-group="%id%"
	title="%title% Transparency" type="range" min="0" max="1" step="0.01" value="1" oninput="updateColor('%id%');">
	<span class="form-control colorDisplay" 
	data-group="%id%" 
	style="max-width: 64px; height: 32px; --displayColor: rgba(0, 0, 0, 0);" id="%id%-colordisplay">Hi!!</span></div>`,
	text: `<label for="%id%" class="form-label">%title%</label>
	<input
		type="text"
		class="form-control textInput"
		id="%id%"
		title="%title%"
		placeholder="%title%"
	/>`,
}

const sections = {
	style: "Style",
	nextMatchColors: "Next Match",
	rosterViewColors: "Roster View",
	mapViewColors: "Maps View",
	teamImages: "Team Images",
	icons: "Icons",
	overlay: "CSS",
	extra: "Extras",
	extraText: "Extra Text"
}

const options = {
	primaryColor: {
		visibleName: "Primary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#c2c2c2" }, value: "#ffffff" }
	},
	secondaryColor: {
		visibleName: "Secondary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#474747" }, value: "#ffffff" }
	},
	tertiaryColor: {
		visibleName: "Tertiary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	quaternaryColor: {
		visibleName: "Quaternary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	quinaryColor: {
		visibleName: "Quinary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	senaryColor: {
		visibleName: "Senary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	septenaryColor: {
		visibleName: "Septenary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	octonaryColor: {
		visibleName: "Octonary Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	// Next Match
	nextMatchPrimaryColor: {
		visibleName: "Next Match Primary",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchBackgroundColor: {
		visibleName: "Next Match Background",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#474747" }, value: "#ffffff" }
	},
	nextMatchVSBlockColor: {
		visibleName: "Next Match VS Block",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchVSBlockTextColor: {
		visibleName: "Next Match VS Block Text",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchTeamNameColor: {
		visibleName: "Next Match Team Name Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchBorderColor: {
		visibleName: "Next Match Border Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchCurrentMatchBorderColor: {
		visibleName: "Next Match (Current Match) Border Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchCompletedMatchBorderColor: {
		visibleName: "Next Match (Completed Match) Border Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchMatchInfoTextColor: {
		visibleName: "Next Match Next Match Info Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchScoreboxBackgroundColor: {
		visibleName: "Next Match Scorebox Background Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchScoreboxTextColor: {
		visibleName: "Next Match Scorebox Text Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchCompletedMatchScoreboxBackgroundColor: {
		visibleName: "Next Match Completed Match Scorebox Background Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	nextMatchCompletedMatchScoreboxTextColor: {
		visibleName: "Next Match Completed Match Scorebox Text Color",
		type: "color",
		section: "nextMatchColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	// Roster View
	rosterViewNameplateBackgroundColor: {
		visibleName: "Roster View Nameplate Background Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewNameplateTextColor: {
		visibleName: "Roster View Nameplate Text Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewTeamNameplateBackgroundColor: {
		visibleName: "Roster View Team Nameplate Background Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewTeamNameplateTextColor: {
		visibleName: "Roster View Team Nameplate Text Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewNameplateQuoteColor: {
		visibleName: "Roster View Nameplate Player Quote Text Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewBackgroundBoxColor: {
		visibleName: "Roster View Background Box Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	rosterViewBackgroundBoxColor: {
		visibleName: "Roster View Background Box Color",
		type: "color",
		section: "rosterViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	teamLeftColor: {
		visibleName: "Team Left Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#2989b2" }, value: "#ffffff" }
	},
	teamRightColor: {
		visibleName: "Team Right Color",
		type: "color",
		section: "style",
		default: { data: { transparency: 1, baseHex: "#a91320" }, value: "#ffffff" }
	},
	// Map View
	
	mapViewIncompleteMapBackgroundColor: {
		visibleName: "Incomplete Map Overlay Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#2989b2" }, value: "#ffffff" }
	},
	mapViewDrawMapBackgroundColor: {
		visibleName: "Drawn Map Overlay Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#2989b2" }, value: "#ffffff" }
	},
	mapViewDrawMapTextColor: {
		visibleName: "Drawn Map Text Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#2989b2" }, value: "#ffffff" }
	},
	mapViewMapNameColor: {
		visibleName: "Map Name Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	mapViewGamemodeTextColor: {
		visibleName: "Gamemode Text Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	mapViewMatchNameColor: {
		visibleName: "Match Name Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	mapViewLeftSideBorderColor: {
		visibleName: "Left Border Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	mapViewRightSideBorderColor: {
		visibleName: "Right Border Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},
	mapViewBackgroundColor: {
		visibleName: "Background Color",
		type: "color",
		section: "mapViewColors",
		default: { data: { transparency: 1, baseHex: "#ffffff" }, value: "#ffffff" }
	},

	// CSS
	teamLeftImage: {
		visibleName: "Team Left Image",
		type: "imageAsset",
		section: "teamImages"
	},
	teamRightImage: {
		visibleName: "Team Right Image",
		type: "imageAsset",
		section: "teamImages"
	},
	scoreOverlayCSS: {
		visibleName: "Score Overlay CSS",
		type: "css",
		section: "overlay",
		default: `#team1score {
	position: absolute;
	top: 15px;
	left: 630px;
	font-family: "FuturaPTHeavy", Arial, sans-serif;
}

#team1name {
	position: absolute;
	top: 15px;
	left: 90px;
	color: #3a3a3a;
}

#team1role {
    position: absolute;
    top: 12px;
    left: 677px;
}
#team2score {
	position: absolute;
	top: 15px;
	right: 630px;
	font-family: "FuturaPTHeavy", Arial, sans-serif;
}

#team2name {
	position: absolute;
	top: 15px;
	text-align: right;
	right: 90px;
	color: #3a3a3a;
}

#team2role {
    position: absolute;
    top: 12px;
    right: 677px;
}

.matchTitle {
	position: absolute;
	top: -20px;
	left: 50%;
	margin-left: -141px;
	transition-delay: 2s;
	transition: all 2s;
}

.matchTitle > div {
	list-style: none;
	position: relative;
	top: 28px;
	text-align: center;
	font-family: "FuturaPTHeavy", Arial, sans-serif;
	color: #3a3a3a;
}
.casters{
	transition: all 2s;
	position: absolute;
	bottom: 0px;
	left: calc(50% - 242.5px);
}

.casterName{
	font-family: "FuturaPTHeavy", Arial, sans-serif;
	font-size: 24px;
	position: absolute;
	left: 155px;
}

.casters > .caster1{
	top: 15px;
}
.casters > .caster2{
	top: 45px;
}
.teamLogo {
	max-height: 45px;
	max-width: 45px;
}

.displayLeft {
	position: absolute;
	top: 10px;
	left: 0%;
}

.displayRight {
	position: absolute;
	top: 10px;
	right: 0%;
}`
	},
	rosterCSS: {
		visibleName: "Team Roster CSS",
		type: "css",
		section: "overlay",
		default: `.offscreen {
	transform: scaleX(0);
	transform-origin: 0% 50%;
	transition-duration: 1s !important;
}

body {
	background-color: gray;
	margin: 0px auto;
	overflow: hidden;
}

/* Animation Stuff */

.namePlate.offscreen {
	transition: transform 1s, opacity 2s !important;
	transform-origin: 0% 50% !important;
	transform: scaleX(0) !important;
	/*transition-duration: 0s !important;*/
}

.namePlate:not(.offscreen) {
	transition: transform 2s, opacity 2s !important;
	transition-duration: 0.7s !important;
	transition-delay: 1.5s;
	transform-origin: 0% 50% !important;
}

#player1>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.5s !important;
}

#player2>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.6s !important;
}

#player3>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.7s !important;
}
#player4>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.8s !important;
}
#player5>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.9s !important;
}
#player6>.heroDisplay>.namePlate:not(.offscreen) {
	transition-delay: 2s !important;
}

#team>.teamDisplay>.namePlate:not(.offscreen) {
	transition-delay: 1.8s !important;
}

.teamInformation {
	transform-origin: 0% 50%;
	transition-duration: 1s !important;
}

.playerDisplay.offscreen {
	transform-origin: 0% 50%;
}

.playerDisplay:not(.offscreen) {
	transform-origin: 0% 50%;
	transition-duration: 0.5s !important;
}

.offscreen:nth-child(6) {
	transition-delay: 0.0s !important;
}

.offscreen:nth-child(5) {
	transition-delay: 0.1s !important;
}

.offscreen:nth-child(4) {
	transition-delay: 0.2s !important;
}

.offscreen:nth-child(3) {
	transition-delay: 0.3s !important;
}

.offscreen:nth-child(2) {
	transition-delay: 0.4s !important;
}

.offscreen:nth-child(1) {
	transition-delay: 0.5s !important;
}

.playerDisplay:nth-child(1) {
	transition-delay: 0.1s;
}

.playerDisplay:nth-child(2) {
	transition-delay: 0.2s;
}

.playerDisplay:nth-child(3) {
	transition-delay: 0.3s;
}

.playerDisplay:nth-child(4) {
	transition-delay: 0.4s;
}

.playerDisplay:nth-child(5) {
	transition-delay: 0.5s;
}

.playerDisplay:nth-child(6) {
	transition-delay: 0.6s;
}

.vertical {
	transform: translateY(25%);
}`
	},
	nextMatchCSS: {
		visibleName: "Match List CSS",
		type: "css",
		section: "overlay",
		default: ``
	},
	mapCSS: {
		visibleName: "Map List CSS",
		type: "css",
		section: "overlay",
		default: ``
	},
	credits: {
		visibleName: "Credits HTML",
		type: "css",
		section: "overlay",
		default: `<span class="title-nottitle">CREDITS</span><br />
<span class="teamname-notteamname">EVENT PRODUCERS</span>
<span class="info-notinfo">KSY</span>
<span class="teamname-notteamname">EVENT COORDINATORS</span>
<span class="info-notinfo">KSY, Sdogga Man</span>
<span class="teamname-notteamname">STREAMERS</span>
<span class="info-notinfo">Sdogga Man</span>
<span class="teamname-notteamname">CASTERS</span>
<span class="info-notinfo">PapaDaka x Oparer</span>
<span class="teamname-notteamname">STREAM TECHNICAL ASSISTANTS</span>
<span class="info-notinfo">Temporalic, Shadow & Sdogga Man</span>
<span class="teamname-notteamname">SPECIAL THANKS</span>
<span class="info-notinfo">To BGG Group for their graphics, the players, everyone in the KE community and
	everyone watching the stream.</span>`
	},
	castersNamesBackground: {
		visibleName: "Casters Names Background",
		type: "imageAsset",
		section: "extra"
	},
	mapBackground: {
		visibleName: "Maps Background",
		type: "imageAsset",
		section: "extra"
	},
	brandingBackground: {
		visibleName: "Branding Background",
		type: "imageAsset",
		section: "extra"
	},
	brandingOverlay: {
		visibleName: "Branding Overlay",
		type: "imageAsset",
		section: "extra"
	},
	orgIcon: {
		visibleName: "Org Icon",
		type: "imageAsset",
		section: "extra"
	},
	font: {
		visibleName: "Font",
		type: "text",
		section: "style",
		default: `Teko`
	},
	scoreboxYOffset: {
		visibleName: "Scorebox Y Offset (13px for Teko Font, 0px for Koverwatch)",
		type: "text",
		section: "style",
		default: `0px`
	},
	scoreboxVSFontSize: {
		visibleName: "Scorebox VS Font Size (5em for Teko Font, 5.5px for Koverwatch)",
		type: "text",
		section: "style",
		default: `5.5em`
	},
	advertBoxSpinnerLines: {
		visibleName: "Spinner Text Lines (Separated by <pre style='display: inline;'>||</pre>)",
		type: "text",
		section: "style",
		default: `Koala Esports||Follow us on Social Media||Follow us on Twitch||discord.gg/koalaesports`
	},
	globalCSS: {
		visibleName: "Global CSS Injection",
		type: "css",
		section: "style",
		default: `@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/e48727/00000000000000007735a648/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3") format("woff2"),url("https://use.typekit.net/af/e48727/00000000000000007735a648/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3") format("woff"),url("https://use.typekit.net/af/e48727/00000000000000007735a648/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:800;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/44c438/00000000000000007735a64e/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),url("https://use.typekit.net/af/44c438/00000000000000007735a64e/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),url("https://use.typekit.net/af/44c438/00000000000000007735a64e/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:700;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/08fe52/00000000000000007735a650/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/08fe52/00000000000000007735a650/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/08fe52/00000000000000007735a650/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:400;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/b5c0af/00000000000000007735a652/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3") format("woff2"),url("https://use.typekit.net/af/b5c0af/00000000000000007735a652/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3") format("woff"),url("https://use.typekit.net/af/b5c0af/00000000000000007735a652/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:600;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/6dbc52/00000000000000007735a654/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff2"),url("https://use.typekit.net/af/6dbc52/00000000000000007735a654/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff"),url("https://use.typekit.net/af/6dbc52/00000000000000007735a654/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:300;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/ddf216/00000000000000007735a656/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff2"),url("https://use.typekit.net/af/ddf216/00000000000000007735a656/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff"),url("https://use.typekit.net/af/ddf216/00000000000000007735a656/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:500;
}

@font-face {
	font-family:"industry";
	src:url("https://use.typekit.net/af/0a40a2/00000000000000007735a65a/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("woff2"),url("https://use.typekit.net/af/0a40a2/00000000000000007735a65a/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("woff"),url("https://use.typekit.net/af/0a40a2/00000000000000007735a65a/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("opentype");
	font-display:auto;font-style:normal;font-weight:900;
}`
	}
}

function createTheme() {
	// sanatise the input
	const themeName = $('<div>').text($("#newThemeName").val()).html();
	if (themeName.empty || themeName.length == 0) {
		alert("Theme Name isn't set");
		return false;
	}
	const newTheme = {
		name: themeName,
		assets: {}
	}

	for (let key in options) newTheme.assets[key] = options[key].default || "unset"

	console.log(newTheme);
	cachedThemes.push(newTheme);
	cachedCurrentTheme = cachedThemes.length;
	modifyingTheme = newTheme;
}

function updateColor(id) {
	let hex = $(`#${id}`).val();
	let transparency = $(`#${id}-transparency`).val();
	let rgb = hexToRgb(hex);
	$(`#${id}-colordisplay`).get(0).style.setProperty("--displayColor", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`)
}

function updateSelection() {
	console.log("Updating Selection to match", modifyingTheme);

	$("#themeName").html(modifyingTheme.name)

	$(".assetDisplay").each(async (id, dis) => {
		const options = dis.options;
		const optionId = $(dis).attr('id');
		$(options).each(async (optid, option) => {
			if (modifyingTheme.assets[optionId] && modifyingTheme.assets[optionId] == option.getAttribute("data-image-url"))
				$(dis).prop('selectedIndex', optid);
		})
		dis.onchange(null);
	});

	$("input[type=color]").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		console.log(modifyingTheme.assets[optionId]);

		if (modifyingTheme.assets[optionId] && !modifyingTheme.assets[optionId].data) {
			modifyingTheme.assets[optionId] = { data: { baseHex: modifyingTheme.assets[optionId], transparency: 1 } }
		}
		if (modifyingTheme.assets[optionId] != "unset") {
			dis.value = modifyingTheme.assets[optionId].data.baseHex;
			$(`#${optionId}-transparency`).val(modifyingTheme.assets[optionId].data.transparency)
			let rgb = hexToRgb(modifyingTheme.assets[optionId].data.baseHex);
			$(`#${optionId}-colordisplay`).get(0).style.setProperty(`--displayColor`, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${modifyingTheme.assets[optionId].data.transparency})`)

		}
	});


	$(".cssInput, .textInput").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		if (!modifyingTheme.assets[optionId]) modifyingTheme.assets[optionId] = options[optionId].default
		if (modifyingTheme.assets[optionId] != "unset")
			dis.value = modifyingTheme.assets[optionId] || options[optionId].default;
	});
}

function createSection(sectionName) {
	const newSection = document.createElement("div");
	newSection.id = sectionName;
	newSection.classList.add("section");
	newSection.classList.add("container-md");
	newSection.classList.add("row");
	const newSectionTitle = document.createElement("h3");
	newSectionTitle.innerHTML = sections[sectionName];
	newSection.appendChild(newSectionTitle);
	$("#themeConfiguration").append(newSection);
}

function loadConfigurationOptions() {
	const sections = [];
	for (let key in options) {
		const opt = options[key];
		if (!sections.includes(opt.section)) {
			createSection(opt.section);
			sections.push(opt.section);
		}
		console.log(`Loading `, key, opt)
		const newOption = document.createElement("span");
		let template = typeTemplates[opt.type];
		template = template.replaceAll("%id%", key);
		template = template.replaceAll("%title%", opt.visibleName);
		$(newOption).append(template);
		newOption.classList.add("option");
		newOption.classList.add("col-6");

		$(`#${opt.section}`).append(newOption);
	}
	updateAssets();
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function updateAssets() {
	/* Insert the new ones from the array above */
	const options = [];
	if (!themeAssetsCache || themeAssetsCache.length == 0) return;

	var ele = document.createElement("option");
	ele.text = "Not Set";
	ele.id = "unset";
	ele.setAttribute('data-image-url', "unset");
	options.push(ele);

	$.each(themeAssetsCache, function (value) {
		var ele = document.createElement("option");
		const image = themeAssetsCache[value];
		ele.text = image.base;
		ele.id = value;
		ele.setAttribute('data-image-url', image.url);
		options.push(ele);
	});

	$(".assetDisplay").each(async (id, dis) => {
		$(dis).empty();
		options.forEach(function (option) {
			$(dis).append($(option).clone());
		});
		dis.onchange = function (ev) {
			const src = options[dis.selectedIndex].getAttribute('data-image-url');
			$(`#${dis.id}-imageDisplay`).attr('src', src != "unset" ? src : null);
		}
	});
}

function loadTheme() {
	modifyingThemeId = $("#selectTheme").prop('selectedIndex');
	modifyingTheme = cachedThemes[modifyingThemeId]
	for (let key in options) if (!modifyingTheme.assets[key]) modifyingTheme.assets[key] = options[key].default || "unset"
	updateSelection();
	$("#topbar > button").attr("disabled", false);
}

function setCurrent() {
	currentTheme.value = modifyingThemeId;
	updateThemeList();
}

function saveTheme() {
	$(".assetDisplay").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		let option = $("option:selected", dis).attr("data-image-url");
		modifyingTheme.assets[optionId] = option || "unset";
	});

	$("input[type=color]").each(async (id, dis) => {

		const optionId = $(dis).attr('id');
		modifyingTheme.assets[optionId].data.baseHex = dis.value || "#ffffff";
		modifyingTheme.assets[optionId].data.transparency = $(`#${optionId}-transparency`).val() || 1;
		let rgb = hexToRgb(dis.value);
		modifyingTheme.assets[optionId].value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${$(`#${optionId}-transparency`).val() || 1})`
	});

	$(".cssInput, .textInput").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		modifyingTheme.assets[optionId] = dis.value || "";
	});

	alert(`Saved theme ${modifyingTheme.name}`)
}

function deleteTheme() {

}

loadConfigurationOptions();
