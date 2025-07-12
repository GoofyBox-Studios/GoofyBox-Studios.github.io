/* global random songs spicyGroup sugaryGroup upperSaltGroup lowerSaltGroup sourGroup sortableGroup staleGroup goofyGroup musicPlayer */

const iframe = document.querySelector("iframe");

for (let audio of [...document.querySelectorAll("audio")]) {
  audio.onplay = function () {
    for (let audio2 of [...document.querySelectorAll("audio")]) {
      if (audio2 != audio) audio2.pause();
    }
  };
}

function songElementClick(songUrl) {  
//   for (let audio of [...document.querySelectorAll("audio")]) {
//     audio.pause();
//   }

//   if (songUrl.startsWith("https://jummb.us/")) {
//     iframe.src = "playerv6/#" + songUrl.slice(18);
//   } else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox/")) {
//     iframe.src = "playerg6/#song=" + songUrl.slice(37);
//   } else if (songUrl.startsWith("https://goofybox.glitch.me/goofybox")) {
//     iframe.src = "playerg6/#song=" + songUrl.slice(36);
//   } else {
//     iframe.src = "player/#song=" + songUrl.slice(30);
//   }
//   window.scrollTo({ top: 10000.0, behavior: "smooth" });

//   setTimeout(function () {
//     if (!iframe.contentWindow.beepbox.main.isPlayingSong) {
//       iframe.contentWindow.beepbox.startPlaying();
//     }
//   }, 1000);
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
}

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
    }
    
    songElements.push(element);
    group.appendChild(element);
  }
}

random.onclick = function () {
  songElements[Math.floor(Math.random() * songElements.length)].click();
}

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// }

musicPlayer.addEventListener("finish", function () {
  console.log("Finish!");
  songElements[Math.floor(Math.random() * songElements.length)].click();
});

global.ready();