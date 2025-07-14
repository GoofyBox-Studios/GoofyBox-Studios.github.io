const songGroupColours = {
	goofy: ["#ffaf22", "#db7e26", "#933409", "#fbff8b"],
	spicy: ["#db7e26", "#933409", "#70191c"],
	sugary: ["#be59e9", "#ae4cd4", "#674593"],
	upperSalt: ["#1fa0c6", "#1271b6", "#064c8f"],
	lowerSalt: ["#18c423", "#16923e", "#147044"],
	sour: ["#975f3e", "#ab5236", "#7f2553", "#ffccaa"],
	sortable: ["#d4bca1", "#be875d", "#975f3e"],
	stale: ["#999999", "#555555", "#444444"],
	remix: ["#727675", "#575450", "#2b2927", "#b4f296"],
	default: ["#999999", "#555555", "#444444"],
};

function songsLoaded() {
}

let songs = [];

fetch("/songs/songs.json")
.then((response) => response.json())
.then((data) => {
	songs = data;
	songsLoaded();
});