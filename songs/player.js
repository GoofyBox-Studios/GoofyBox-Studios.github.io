/* global playerPrev playerPlay playerNext playerState playerEdit playerProgressValue playerLoop musicPlayerElement songGroupColours */

function lerp(a, b, t) {
	return (b - a) * t + a;
}

const musicPlayer = {};

musicPlayer.iframe = document.querySelector("iframe");
musicPlayer.playing = false;
musicPlayer.loop = false;
musicPlayer.audioPlayer = new Audio();
musicPlayer.willPlayAudio = false;
musicPlayer.playingRecordedAudio = false;
musicPlayer.senseForFinish = false;
musicPlayer.coloursTo = songGroupColours.default;

musicPlayer.audioPlayer.onended = function () {
	// musicPlayer.dispatchEvent("finish");
};

musicPlayer._listeners = {
	finish: [],
};

musicPlayer.dispatchEvent = function (event, data = {}) {
	if (!Array.isArray(musicPlayer._listeners[event])) return;
	
	for (let listener of musicPlayer._listeners[event]) listener(data);
};

musicPlayer.addEventListener = function (event, listener) {
	if (!Array.isArray(musicPlayer._listeners[event])) return;
	
	musicPlayer._listeners[event].push(listener);
};

musicPlayer.playSong = function (songUrl, songName, songGroup) {
	let src = "";
	let usesBeepboxPlayer = true;
	
	if (songUrl.startsWith("https://jummb.us/")) {
		src = "/players/playerv6/#" + songUrl.slice(18);
	} else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox/")) {
		src = "/players/newPlayer/#song=" + songUrl.slice(37);
	} else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox")) {
		src = "/players/newPlayer/#song=" + songUrl.slice(36);
	} else if (songUrl.startsWith("https://goofybox.glitch.me/songs/editor/")) {
		src = "/players/newPlayer/#song=" + songUrl.slice(41);
	} else if (songUrl.startsWith("https://goofybox.glitch.me/songs/editor")) {
		src = "/players/newPlayer/#song=" + songUrl.slice(40);
	} else if (songUrl.startsWith("https://jummbus.bitbucket.io/")) {
		src = "/players/player/#song=" + songUrl.slice(30);
	} else {
		src = songUrl;
		usesBeepboxPlayer = false;
	}
	
	if (!src) return;
	
	musicPlayer.coloursTo = songGroupColours[songGroup];
	
	playerState.innerText = songName;
	if (usesBeepboxPlayer) {
		musicPlayer.iframe.src = src;
		musicPlayer.playing = true;
		
		if (musicPlayer.audioPlayer) musicPlayer.audioPlayer.pause();
		
		musicPlayer.willPlayAudio = false;
		musicPlayer.playingRecordedAudio = false;
		musicPlayer.senseForFinish = true;

		const beepbox = musicPlayer.getBeepbox()?.main;

		if (!beepbox) return;

		beepbox.snapToStart();
		beepbox.play();
	} else {
		musicPlayer.audioPlayer.src = src;
		musicPlayer.willPlayAudio = true;
		musicPlayer.playingRecordedAudio = true;
		musicPlayer.audioPlayer.loop = musicPlayer.loop;
		musicPlayer.senseForFinish = false;
		
		const beepbox = musicPlayer.getBeepbox();
		
		if (!beepbox) return;
		
		musicPlayer.getBeepbox().main.pause();
	}
};

musicPlayer.previousSong = function () {
	if (musicPlayer.playingRecordedAudio) {
		musicPlayer.audioPlayer.currentTime = 0;
	} else {
		const beepbox = musicPlayer.getBeepbox()?.main;

		if (!beepbox) return;

		beepbox.snapToStart();
	}
};

musicPlayer.nextSong = function () {
	// TODO
};

musicPlayer.editSong = function () {
	musicPlayer.setPlaying(false);
	
	let link = "";
	if (musicPlayer.playingRecordedAudio) {
		link = musicPlayer.audioPlayer.src;
	} else {
		const beepbox = musicPlayer.getBeepbox();

		if (!beepbox) return;

		link = beepbox.edit.href;
	}
	
	link = link.replace("/players/", "/songs/editor/");
	window.open(link, "_blank");
};

musicPlayer.setPlaying = function (playing) {
	if (musicPlayer.playingRecordedAudio) {
		if (playing) {
			musicPlayer.audioPlayer.play();
		} else {
			musicPlayer.audioPlayer.pause();
		}
	} else {
		const beepbox = musicPlayer.getBeepbox();

		if (!beepbox) return;

		musicPlayer.playing = playing;
		if (playing) {
			beepbox.main.play();
		} else {
			beepbox.main.pause();
		}
	}
};

musicPlayer.togglePlay = function () {
	if (musicPlayer.playingRecordedAudio) {
		if (musicPlayer.audioPlayer.paused) {
			musicPlayer.audioPlayer.play();
		} else {
			musicPlayer.audioPlayer.pause();
		}
	} else {
		const beepbox = musicPlayer.getBeepbox();

		if (!beepbox) return;

		musicPlayer.playing = !beepbox.playing;
		beepbox.startPlaying();
	}
};

musicPlayer.toggleLoop = function () {
	musicPlayer.loop = !musicPlayer.loop;
	
	if (musicPlayer.playingRecordedAudio) {
		musicPlayer.audioPlayer.loop = musicPlayer.loop;
	}
	
	playerLoop.src = musicPlayer.loop ? "/assets/player/LoopOn.png" : "/assets/player/LoopOff.png";
};

musicPlayer.getSongPosition = function () {
	if (musicPlayer.playingRecordedAudio) {
		return musicPlayer.audioPlayer.currentTime / musicPlayer.audioPlayer.duration;
	} else {
		const beepbox = musicPlayer.getBeepbox()?.main;

		if (!beepbox) return 0;

		return (beepbox.bar * beepbox.song.beatsPerBar + beepbox.beat) / (beepbox.song.beatsPerBar * beepbox.song.barCount);
	}
};

musicPlayer.getBeepbox = function () {
	return musicPlayer.iframe?.contentWindow?.beepbox;
};

musicPlayer.isPlaying = function () {
	if (musicPlayer.playingRecordedAudio) return !musicPlayer.audioPlayer.paused;
	
	const beepbox = musicPlayer.getBeepbox()?.main;

	if (!beepbox) return false;
	
	return beepbox.playing;
};

musicPlayer.setColour = function (propertyName, value) {
	const from = parseInt(musicPlayerElement.style.getPropertyValue(propertyName).substr(1), 16) || 0;
	const to = parseInt(value.substr(1), 16);
	
	const r0 = ((from >> 16));
	const g0 = ((from >> 8) % 256);
	const b0 = (from % 256);
	const r1 = ((to >> 16));
	const g1 = ((to >> 8) % 256);
	const b1 = (to % 256);
	
	const t = 0.1;
	
	const r2 = Math.min(Math.max(Math.round(lerp(r0, r1, t)), 0), 255);
	const g2 = Math.min(Math.max(Math.round(lerp(g0, g1, t)), 0), 255);
	const b2 = Math.min(Math.max(Math.round(lerp(b0, b1, t)), 0), 255);
	
	const result = "#" + r2.toString(16).padStart(2, "0") + g2.toString(16).padStart(2, "0") + b2.toString(16).padStart(2, "0");
	
	musicPlayerElement.style.setProperty(propertyName, result);
};

musicPlayer.update = function () { // TODO
	requestAnimationFrame(musicPlayer.update);
	
	if (musicPlayer.audioPlayer.readyState == 4 && musicPlayer.willPlayAudio) {
		musicPlayer.willPlayAudio = false;
		musicPlayer.audioPlayer.play();
	}
	
	musicPlayer.setColour("--colour-a", musicPlayer.coloursTo[0]);
	musicPlayer.setColour("--colour-b", musicPlayer.coloursTo[1]);
	musicPlayer.setColour("--colour-c", musicPlayer.coloursTo[2]);
	musicPlayer.setColour("--colour-d", musicPlayer.coloursTo[3] ?? "#ffffff");
	
	playerPlay.src = (musicPlayer.isPlaying()) ? "/assets/player/Playing.png" : "/assets/player/Paused.png";
	playerProgressValue.style.width = (musicPlayer.getSongPosition() * 100).toFixed(2) + "%";
	
	const beepbox = musicPlayer.getBeepbox()?.main;
	if (!beepbox) return;
	
	if (musicPlayer.senseForFinish && musicPlayer.playing) {
		if (!beepbox.playing) {
			if (beepbox.bar == 0 && beepbox.beat == 0) {
				// console.log("Finished");
				// musicPlayer.dispatchEvent("finish");
			}
		}
	}
	
	beepbox.loopRepeatCount = musicPlayer.loop ? -1 : 0;
};

document.body.addEventListener("keydown", function (event) {
	if (event.code == "Space") {
		event.preventDefault();
		musicPlayer.togglePlay();
	}
	
	if (event.code == "KeyL") {
		event.preventDefault();
		musicPlayer.toggleLoop();
	}
	
	if (event.code == "Digit0") {
		event.preventDefault();
		musicPlayer.previousSong();
	}
	
	if (event.code == "KeyE" && (event.ctrlKey || event.metaKey)) {
		event.preventDefault();
		musicPlayer.editSong();
	}
});

playerLoop.onclick = musicPlayer.toggleLoop;
playerPrev.onclick = musicPlayer.previousSong;
playerPlay.onclick = musicPlayer.togglePlay;
playerNext.onclick = musicPlayer.nextSong;
playerEdit.onclick = musicPlayer.editSong;

musicPlayer.update();