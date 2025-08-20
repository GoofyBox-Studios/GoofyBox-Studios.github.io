const iframe = document.querySelector("iframe");

for (let audio of [...document.querySelectorAll("audio")]) {
	audio.onplay = function () {
		for (let audio2 of [...document.querySelectorAll("audio")]) {
			if (audio2 != audio) audio2.pause();
		}
	};
}

let songs = {};
let albums = {};

Promise.all([
	fetch(siteDataURL + "/songs.json").then((response) => response.json()),
	fetch(siteDataURL + "/albums.json").then((response) => response.json())
])
.then(([songsData, albumsData]) => {
	songs = songsData;
	albums = albumsData;

	songsLoaded();
});


let currentlyPlaying = null;

const songElements = [];
function songsLoaded() {
	const albumNames = ["everything", ...Object.keys(albums)];

	albums["everything"] = {
		"title": "Everything",
		"cover": "/music_icons/everything.png",
		"songs": Object.keys(songs).sort((a, b) => a.localeCompare(b))
	};

	for (const albumName of albumNames) {
		const album = albums[albumName];

		const node = document.createElement("div");
		node.classList.add("album");
		const title = document.createElement("span");
		title.innerText = album.title;

		const art = document.createElement("div");
		art.classList.add("art");
		const cover = document.createElement("img");
		cover.src = album.cover ? (siteDataURL + album.cover) : "/assets/main/Cookie.png";
		art.appendChild(cover);
		const play = document.createElement("span");
		play.innerText = "play_arrow";
		play.classList.add("material-symbols-outlined");
		play.classList.add("play-button");
		art.appendChild(play);
		const shuffle = document.createElement("span");
		shuffle.innerText = "shuffle";
		shuffle.classList.add("material-symbols-outlined");
		shuffle.classList.add("shuffle-button");
		art.appendChild(shuffle);

		node.append(art);
		node.append(title);

		document.getElementById("albums").appendChild(node);
		
		art.onclick = () => {
			musicPlayer.playAlbum(album);
		}
		
		shuffle.onclick = (event) => {
			event.preventDefault();
			event.stopPropagation();
			musicPlayer.playAlbum(album, true);
		}
	}
}

global.ready();