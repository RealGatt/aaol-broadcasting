let maps = null;
$.ajax({
    url: "../../assets/data/maps.json",
    success: function (data) {
        maps = data;
    },
});
function findMap(mapName) {
    return maps.allmaps.filter((map) => map.name == mapName)[0]
}