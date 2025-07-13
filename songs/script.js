/* global random songs spicyGroup sugaryGroup upperSaltGroup lowerSaltGroup sourGroup sortableGroup staleGroup goofyGroup musicPlayer */

const iframe = document.querySelector("iframe");

for (let audio of [...document.querySelectorAll("audio")]) {
	audio.onplay = function () {
		for (let audio2 of [...document.querySelectorAll("audio")]) {
			if (audio2 != audio) audio2.pause();
		}
	};
}

const groups = {
	"testy": document.getElementById("testyGroup"),
	"goofy": document.getElementById("goofyGroup"),
	"spicy": document.getElementById("spicyGroup"),
	"sugary": document.getElementById("sugaryGroup"),
	"upperSalt": document.getElementById("upperSaltGroup"),
	"lowerSalt": document.getElementById("lowerSaltGroup"),
	"sour": document.getElementById("sourGroup"),
	"sortable": document.getElementById("sortableGroup"),
	"stale": document.getElementById("staleGroup"),
	"remix": document.getElementById("remixGroup"),
};

let currentlyPlaying = null;

const songElements = [];
for (let songGroupName in songs) {
	const group = groups[songGroupName];
	
	if (!group) continue;
	
	for (let songName in songs[songGroupName]) {
		const songUrl = songs[songGroupName][songName];
		
		const element = document.createElement("div");
		element.innerText = songName;
		element.classList.add("song");
		element.onclick = function (event) {
			event.preventDefault();
			
			if (currentlyPlaying) currentlyPlaying.classList.remove("playing");
			
			currentlyPlaying = element;
			currentlyPlaying.classList.add("playing");
			
			musicPlayer.playSong(songUrl, songName, songGroupName);
		};
		
		songElements.push(element);
		group.appendChild(element);
	}
}

random.onclick = function () {
	songElements[Math.floor(Math.random() * songElements.length)].click();
};

musicPlayer.addEventListener("finish", function () {
	console.log("Finish!");
	songElements[Math.floor(Math.random() * songElements.length)].click();
});

global.ready();