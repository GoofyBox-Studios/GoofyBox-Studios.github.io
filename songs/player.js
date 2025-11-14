function lerp(a, b, t) {
	return (b - a) * t + a;
}

class MusicPlayer {
	constructor() {
		this.iframe = document.querySelector("iframe");
		this.playing = false;
		this.loop = false;
		this.audioPlayer = new Audio();
		this.audioPlayer.crossOrigin = "anonymous";
		this.willPlayAudio = false;
		this.playingRecordedAudio = false;
		this.senseForFinish = false;
		this.wasPlaying = false;
		this.elements = {
			player: document.getElementById("musicPlayerElement"),
			queue: document.getElementById("music-player-queue"),
			playerLoop: document.getElementById("playerLoop"),
			playerPrev: document.getElementById("playerPrev"),
			playerPlay: document.getElementById("playerPlay"),
			playerNext: document.getElementById("playerNext"),
			playerEdit: document.getElementById("playerEdit"),
			playerExpand: document.getElementById("playerExpand"),
		};

		this.currentAlbum = null;
		this.queue = [];
		this.currentQueueIndex = 0;

		this._listeners = {
			finish: [],
		};

		document.body.addEventListener("keydown", (event) => {
			if (event.repeat) return;

			if (event.code == "Space") {
				event.preventDefault();
				this.togglePlay();
			}

			if (event.code == "KeyL") {
				event.preventDefault();
				this.toggleLoop();
			}

			if (event.code == "Digit0") {
				event.preventDefault();
				this.restartSong();
			}

			if (event.code == "KeyQ") {
				event.preventDefault();
				playerExpand.onclick();
			}

			if (event.code == "KeyE" && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				this.editSong();
			}
		});

		// this.audioPlayer.onended = function () {
		// 	console.log("Ended!");
		// };

		this.elements.playerLoop.onclick = () => this.toggleLoop();
		this.elements.playerPrev.onclick = () => this.previousSong();
		this.elements.playerPlay.onclick = () => this.togglePlay();
		this.elements.playerNext.onclick = () => this.nextSong();
		this.elements.playerEdit.onclick = () => this.editSong();
		this.elements.playerExpand.onclick = () => document.querySelector(".music-player-content").classList.toggle("expanded");

		this.selectedSongElement = null;

		this.update();
	}

	dispatchEvent(event, data = {}) {
		if (!Array.isArray(this._listeners[event])) return;

		for (let listener of this._listeners[event]) listener(data);
	}

	addEventListener(event, listener) {
		if (!Array.isArray(this._listeners[event])) return;

		this._listeners[event].push(listener);
	}

	playAlbum(album, shuffle) {
		this.queue = [...album.songs];
		this.currentQueueIndex = 0;
		if (shuffle) {
			for (let i = this.queue.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
			}
		}
		this.currentAlbum = album;
		this.playSong(this.queue[this.currentQueueIndex]);
		this.reloadQueueElement();
	}

	playSong(songName) {
		this.elements.player.classList.remove("no-song");
		document.title = songName;
		const song = songs[songName];
		let usesBeepboxPlayer = true;

		const version = song.versions[song.versions.length - 1];

		const songUrl = version?.url ?? version;
		let src = "";
		let editSrc = "";
		if (songUrl.startsWith("https://jummb.us/")) {
			src = "/players/playerv6/#" + songUrl.slice(18);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(18);
		} else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox/")) {
			src = "/players/newPlayer/#song=" + songUrl.slice(37);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(37);
		} else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox")) {
			src = "/players/newPlayer/#song=" + songUrl.slice(36);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(36);
		} else if (songUrl.startsWith("https://goofybox.glitch.me/songs/editor/")) {
			src = "/players/newPlayer/#song=" + songUrl.slice(41);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(41);
		} else if (songUrl.startsWith("https://goofybox.glitch.me/songs/editor")) {
			src = "/players/newPlayer/#song=" + songUrl.slice(40);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(40);
		} else if (songUrl.startsWith("https://jummbus.bitbucket.io/")) {
			src = "/players/player/#song=" + songUrl.slice(30);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(30);
		} else if (songUrl.startsWith("https://goofybox-studios.github.io/songs/editor/")) {
			src = "/players/newPlayer/#song=" + songUrl.slice(49);
			editSrc = "https://goofybox-studios.github.io/songs/editor/#" + songUrl.slice(49);
		} else if (songUrl.startsWith("https://slarmoo.github.io/slarmoosbox/website/")) {
			src = "/players/slarmoo/#song=" + songUrl.slice(47);
			editSrc = "https://slarmoo.github.io/slarmoosbox/website/#" + songUrl.slice(47);
		} else {
			src = siteDataURL + songUrl;
			usesBeepboxPlayer = false;
		}

		if (!src) return;
		this.editSrc = editSrc;

		document.querySelector("#playerState span").innerText = song.title;

		let cover = song.cover ?? this.currentAlbum?.cover;
		cover = cover ? (siteDataURL + cover) : "/assets/main/Cookie.png";
		document.querySelector("#playerState img").src = cover;
		document.querySelector(".music-player-content > img").src = cover;
		document.querySelector(".music-player-content").style.setProperty("--background-image", "url(" + cover + ")");

		if (usesBeepboxPlayer) {
			this.iframe.src = src;
			this.playing = true;

			if (this.audioPlayer) this.audioPlayer.pause();

			this.willPlayAudio = false;
			this.playingRecordedAudio = false;
			this.senseForFinish = true;

			const beepbox = this.getBeepbox()?.main;

			if (!beepbox) return;

			beepbox.snapToStart();
			beepbox.play();
		} else {
			this.audioPlayer.src = src;
			this.willPlayAudio = true;
			this.playingRecordedAudio = true;
			this.audioPlayer.loop = this.loop;
			this.senseForFinish = false;

			const beepbox = this.getBeepbox();

			if (!beepbox) return;

			this.getBeepbox().main.pause();
		}
	}

	restartSong() {
		if (this.playingRecordedAudio) {
			this.audioPlayer.currentTime = 0;
		} else {
			const beepbox = this.getBeepbox()?.main;

			if (!beepbox) return;

			beepbox.snapToStart();
		}
	}

	previousSong() {
		if (this.selectedSongElement == null) return;

		this.selectedSongElement.classList.remove("current");

		this.currentQueueIndex -= 1;
		if (this.currentQueueIndex < 0) {
			this.stopSong();
			this.currentQueueIndex = 0;
		} else {
			this.playSong(this.queue[this.currentQueueIndex]);
			this.selectedSongElement = this.selectedSongElement.previousElementSibling;
			this.selectedSongElement.classList.add("current");
		}
		this.reloadQueueElement();
	}

	nextSong() {
		if (this.selectedSongElement == null) return;

		this.selectedSongElement.classList.remove("current");

		this.currentQueueIndex += 1;
		if (this.currentQueueIndex >= this.queue.length) {
			this.stopSong();
		} else {
			this.playSong(this.queue[this.currentQueueIndex]);
			this.selectedSongElement = this.selectedSongElement.nextElementSibling;
			this.selectedSongElement.classList.add("current");
		}
		this.reloadQueueElement();
	}

	editSong() {
		this.setPlaying(false);

		// let link = "";
		// if (this.playingRecordedAudio) {
		// 	link = this.audioPlayer.src;
		// } else {
		// 	const beepbox = this.getBeepbox();

		// 	if (!beepbox) return;

		// 	link = beepbox.edit.href;
		// }

		// link = link.replace("/players/", "/songs/editor/");
		window.open(this.editSrc, "_blank");
	}

	setPlaying(playing) {
		if (this.playingRecordedAudio) {
			if (playing) {
				this.audioPlayer.play();
			} else {
				this.audioPlayer.pause();
			}
		} else {
			const beepbox = this.getBeepbox();

			if (!beepbox) return;

			this.playing = playing;
			if (playing) {
				beepbox.main.play();
			} else {
				beepbox.main.pause();
			}
		}
	}

	stopSong() {
		document.title = "GoofyBox - Jukebox";
		if (this.playingRecordedAudio) {
			this.audioPlayer.pause();
		} else {
			const beepbox = this.getBeepbox();

			if (!beepbox) return;

			this.playing = false;
			beepbox.main.isPlayingSong = false;
		}
	}

	togglePlay() {
		if (this.playingRecordedAudio) {
			if (this.audioPlayer.paused) {
				this.audioPlayer.play();
			} else {
				this.audioPlayer.pause();
			}
		} else {
			const beepbox = this.getBeepbox();

			if (!beepbox) return;

			this.playing = !beepbox.playing;
			beepbox.startPlaying();
		}
	}

	toggleLoop() {
		this.loop = !this.loop;

		if (this.playingRecordedAudio) {
			this.audioPlayer.loop = this.loop;
		}

		playerLoop.innerText = this.loop ? "repeat_on" : "repeat";
	}

	getSongPosition() {
		if (this.playingRecordedAudio) {
			return this.audioPlayer.currentTime / this.audioPlayer.duration;
		} else {
			const beepbox = this.getBeepbox()?.main;

			if (!beepbox) return 0;

			return (beepbox.bar * beepbox.song.beatsPerBar + beepbox.beat) / (beepbox.song.beatsPerBar * beepbox.song.barCount);
		}
	}

	getBeepbox() {
		return this.iframe?.contentWindow?.beepbox;
	}

	isPlaying() {
		if (this.playingRecordedAudio) return !this.audioPlayer.paused;

		const beepbox = this.getBeepbox()?.main;

		if (!beepbox) return false;

		return beepbox.playing;
	}

	setColour(propertyName, value) {
		const from = parseInt(this.elements.player.style.getPropertyValue(propertyName).substr(1), 16) || 0;
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

		this.elements.player.style.setProperty(propertyName, result);
	}

	getSongLength() {
		if (this.playingRecordedAudio) {
			throw "Cannot get length with recorded audio!";
		}

		return this.getBeepbox().main.getTotalSamples() / this.getBeepbox().main.samplesPerSecond;
	}

	update() {
		requestAnimationFrame(() => this.update());

		if (this.audioPlayer.readyState == 4 && this.willPlayAudio) {
			this.willPlayAudio = false;
			this.audioPlayer.play();
		}

		const playing = this.isPlaying();
		if (this.wasPlaying !== playing) {
			this.wasPlaying = playing;

			playerPlay.innerText = playing ? "pause" : "play_arrow";
		}
		playerProgressValue.style.width = (this.getSongPosition() * 100).toFixed(2) + "%";

		const beepbox = this.getBeepbox()?.main;
		if (!beepbox) return;

		if (this.senseForFinish && this.playing) {
			if (!beepbox.playing) {
				if (beepbox.bar == 0 && beepbox.beat == 0) {
					// console.log("Finished");
					// this.dispatchEvent("finish");
				}
			}
		}

		beepbox.loopRepeatCount = this.loop ? -1 : 0;
	}

	reloadQueueElement() {
		utils.deleteAllChildren(this.elements.queue);

		for (let index in this.queue) {
			const song = songs[this.queue[index]];
			const latestVersion = song.versions[song.versions.length - 1];

			const row = document.createElement("div");
			if (index == this.currentQueueIndex) {
				this.selectedSongElement = row;
				row.classList.add("current");
			}

			const art = document.createElement("div");
			art.classList.add("art");
			const img = document.createElement("img");
			let cover = song.cover ?? this.currentAlbum?.cover;
			img.src = cover ? (siteDataURL + cover) : "/assets/main/Cookie.png";
			art.appendChild(img);
			const play = document.createElement("span");
			play.innerText = "play_arrow";
			play.classList.add("material-symbols-outlined");
			art.appendChild(play);
			row.appendChild(art);

			const box = document.createElement("div");
			box.classList.add("names");

			const text = document.createElement("span");
			text.innerText = song.title;
			box.appendChild(text);
			let authors = new Set();
			for (let version of song.versions) {
				if (typeof version === "object" && version.authors) {
					for (let author of version.authors) {
						authors.add(author);
					}
				}
			}

			if (authors.size > 0) {
				const subText = document.createElement("span");
				subText.innerText = [...authors].join(", ") + " - " + latestVersion.date;
				box.appendChild(subText);
			}

			row.appendChild(box);

			this.elements.queue.appendChild(row);

			art.onclick = () => {
				this.selectedSongElement.classList.remove("current");
				row.classList.add("current");
				this.selectedSongElement = row;

				this.currentQueueIndex = +index;
				this.playSong(this.queue[index]);
				// this.reloadQueueElement();
			}
		}
	}
}

const musicPlayer = new MusicPlayer();