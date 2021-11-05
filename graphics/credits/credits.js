useTheme();
useTeam();
waitForLoad(() => {
    $('body').css("border-color", 'var(--TERTIARY)');
    $('.matchinfo, .socials, .title').css("color", "var(--QUINARY)");
    $('.teamscore, .gg').css("color", "var(--TERTIARY)");
    $('.vs').css("background-color", "var(--TERTIARY)");
    $('.vs').css("color", "var(--PRIMARY)");
    $('.scorebox').css("background-color", "var(--QUATERNARY)");

    $('body').css("border-color", "var(--TERTIARY)");
    $('.info').css("color", "var(--SENARY)");

    $('span.tertiary').css("background-color", ("var(--PRIMARY)"));
    $('span.tertiary').css("color", ("var(--SECONDARY)"));
    $('span.tertiary').css("border-color", ("var(--TERTIARY)"));

    $(".info").html(cachedMatchConfiguration.matchTitle)
    $("#userStyle").html(cachedThemeObj.assets.rosterCSS)
    if (cachedThemeObj.assets.credits)
        $("#credits").html(cachedThemeObj.assets.credits);
})