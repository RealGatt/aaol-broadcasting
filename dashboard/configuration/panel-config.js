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

const templates = {
	colors: `<label for="%id%" class="form-label">%title%</label>
	<input
		type="color"
		class="form-control form-control-color"
		id="%id%"
		title="%title%"
	/>`,
	teamImages: `
	<label for="%id%" class="form-label">%title%</label>
	<select
		class="form-select assetDisplay"
		name="%id%"
		id="%id%"
	></select>
	<img id="%id%-imageDisplay" class="form-control imageDisplay"></img>`,
	icons: `
	<label for="%id%" class="form-label">%title%</label>
	<select
		class="form-select assetDisplay"
		name="%id%"
		id="%id%"
	></select>
	<img id="%id%-imageDisplay" class="icon"></img>`,
	extra: `
	<label for="%id%" class="form-label">%title%</label>
	<select
		class="form-select assetDisplay"
		name="%id%"
		id="%id%"
	></select>
	<img id="%id%-imageDisplay" class="form-control imageDisplay"></img>`,
}

const sections = {
	colors: "Colors",
	teamImages: "Team Images",
	icons: "Icons",
	extra: "Extras"
}

const options = {
	primaryColor: {
		visibleName: "Primary Color",
		type: "color",
		section: "colors",
		default: "#c2c2c2"
	},
	secondaryColor: {
		visibleName: "Second Color",
		type: "color",
		section: "colors",
		default: "#474747"
	},
	teamLeftColor: {
		visibleName: "Team Left Color",
		type: "color",
		section: "colors",
		default: "#2989b2"
	},
	teamRightColor: {
		visibleName: "Team Right Color",
		type: "color",
		section: "colors",
		default: "#a91320"
	},
	teamLeftImage: {
		visibleName: "Team Left Image",
		type: "asset",
		section: "teamImages"
	},
	teamRightImage: {
		visibleName: "Team Right Image",
		type: "asset",
		section: "teamImages"
	},
	attackIcon: {
		visibleName: "Attack Icon",
		type: "asset",
		section: "icons"
	},
	defenseIcon: {
		visibleName: "Defense Icon",
		type: "asset",
		section: "icons"
	},
	castersNamesBackground: {
		visibleName: "Casters Names Background",
		type: "asset",
		section: "extra"
	},
	mapBackground: {
		visibleName: "Maps Background",
		type: "asset",
		section: "extra"
	},
	brandingBackground: {
		visibleName: "Branding Background",
		type: "asset",
		section: "extra"
	},
	brandingOverlay: {
		visibleName: "Branding Overlay",
		type: "asset",
		section: "extra"
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

	$(".form-control-color").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		if (modifyingTheme.assets[optionId] != "unset")
			dis.value = modifyingTheme.assets[optionId];
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

		const newOption = document.createElement("span");
		let template = templates[opt.section];
		template = template.replaceAll("%id%", key);
		template = template.replaceAll("%title%", opt.visibleName);
		$(newOption).append(template);
		newOption.classList.add("option");
		newOption.classList.add("col-6");

		$(`#${opt.section}`).append(newOption);
	}
	updateAssets();
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

	$(".form-control-color").each(async (id, dis) => {
		const optionId = $(dis).attr('id');
		modifyingTheme.assets[optionId] = dis.value || "#ffffff";
	});

	alert(`Saved theme ${modifyingTheme.name}`)
}

function deleteTheme() {

}

loadConfigurationOptions();
