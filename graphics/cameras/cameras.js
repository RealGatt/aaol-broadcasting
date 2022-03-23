$(".wrapper").addClass("LOADING");
useTheme();
useTeam();
waitForLoad(() => {
    $(".LOADING").removeClass("LOADING");
})


matchConfigUpdateCallback = async () => {
    updateCameras();
}

themeCallback = async () => {
    await loadColors("camera");
    await loadCustomCSS("cameraCSS");
}

function updateCameras() {
    console.log("Loaded Match Configuration", cachedMatchConfiguration);
    var staff = [
        "caster1", "caster2"
    ];
    var urlParams = new URLSearchParams(window.location.search);
    let casteroverride = null;
    let casternameoverride = null;
    if (urlParams.get("casteroverride")) casternameoverride = urlParams.get("casteroverride");
    if (window.location.pathname.endsWith("single.html")) {
        console.log("single");
        casteroverride = (parseInt(urlParams.get("caster")) - 1);
        staff = [
            "caster1"
        ];
    }
    if (window.location.pathname.endsWith("triple-interview.html") || window.location.pathname.endsWith("trio-cam.html")) {
        console.log("single");
        staff = [
            "caster1", "caster2", "host"
        ];
    }


    //get staff name details
    for (let i = 0; i < staff.length; ++i) {
        let stafftxt = casternameoverride || cachedMatchConfiguration.casters[casteroverride || i];

        $('.curtain' + staff[i]).css("animation-delay", (1.15 + (i * 0.1)) + "s");
        $('.' + staff[i]).css("animation-delay", (1.00 + (i * 0.1)) + "s");

        if (stafftxt.replace(/\n|\r/gi, "") == "") {
            $('.' + staff[i] + ' .staffname').html("");
            $('.' + staff[i] + ' .twitter').html("");
        } else {
            let staffname = stafftxt.replace(new RegExp(/ @\w*/), "");
            let stafftwitter = stafftxt.match(new RegExp(/ @\w*/))
            if (stafftwitter != null) {
                stafftwitter = stafftwitter.toString()
                stafftwitter = stafftwitter.replace(/ @/, "")

                $('.' + staff[i] + ' .twitter').html("&nbsp;" + stafftwitter);
                $('.' + staff[i] + ' .twitter').css("display", "block");
                $('.' + staff[i] + ' .staffname').html(staffname + "&nbsp;");
            } else {
                $('.' + staff[i] + ' .twitter').css("display", "none");
                $('.' + staff[i] + ' .staffname').html(staffname);
            }
        }
    }
}