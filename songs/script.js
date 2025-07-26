const iframe = document.querySelector("iframe");

for (let audio of [...document.querySelectorAll("audio")]) {
	audio.onplay = function () {
		for (let audio2 of [...document.querySelectorAll("audio")]) {
			if (audio2 != audio) audio2.pause();
		}
	};
}

let currentlyPlaying = null;

const songElements = [];
function songsLoaded() {
	albums["everything"] = {
		"title": "Everything",
		"cover": "/assets/music_icons/blank.png",
		"songs": Object.keys(songs).sort((a, b) => a.localeCompare(b))
	};

	for (const albumName in albums) {
		const album = albums[albumName];

		const node = document.createElement("div");
		node.classList.add("album");
		const title = document.createElement("span");
		title.innerText = album.title;

		const art = document.createElement("div");
		art.classList.add("art");
		const cover = document.createElement("img");
		cover.src = album.cover ?? "/assets/main/Cookie.png";
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
	// for (let songGroupName in songs) {
	// 	const group = groups[songGroupName];
		
	// 	if (!group) continue;
		
	// 	for (let songName in songs[songGroupName]) {
	// 		const songUrl = songs[songGroupName][songName];
			
	// 		const element = document.createElement("div");
	// 		element.innerText = songName;
	// 		element.classList.add("song");
	// 		element.onclick = function (event) {
	// 			event.preventDefault();
				
	// 			if (currentlyPlaying) currentlyPlaying.classList.remove("playing");
				
	// 			currentlyPlaying = element;
	// 			currentlyPlaying.classList.add("playing");
				
	// 			musicPlayer.playSong(songUrl, songName, songGroupName);
	// 		};
			
	// 		songElements.push(element);
	// 		group.appendChild(element);
	// 	}
	// }
}

// random.onclick = function () {
// 	songElements[Math.floor(Math.random() * songElements.length)].click();
// };

global.ready();