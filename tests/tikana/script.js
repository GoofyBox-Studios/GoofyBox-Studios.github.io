const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const outputImages = document.getElementById("outputImages");
const breakTime = document.getElementById("breakTime");

inputText.onchange = update;
inputText.onkeyup = update;

const adjectives = {
  orange: "xiro",
  magenta: "ana",
  blue: "beta",
  red: "oro",
  green: "vero",
  black: "vaku",
  pink: "ixana",
  light: "ixa",
  white: "ixa"
}

const nouns = {
  cube: "hik",
  cubes: "hikik",
  spike: "rux",
  sphere: "tir",
  money: "kyt",
  mode: "rak",
  puzzle: "huk",
  vibe: "vyb",
  place: "teko",
  number: "xatako",
  language: "tikana",
  change: "kam",
  iris: "yres",
  challenge: "kevos",
  random: "nabet",
  zephyrus: "xetir",
  haizlbliek: "hyxar"
}

const letters = {
  m: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/M.png?v=1736183183441",
  a: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/A.png?v=1736183188148",
  b: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/B.png?v=1736183190064",
  e: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/EE.png?v=1736183191324",
  g: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/G.png?v=1736183197016",
  h: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/H.png?v=1736183197129",
  k: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/K.png?v=1736183200078",
  n: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/N.png?v=1736183201521",
  o: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/O.png?v=1736183202852",
  u: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/OO.png?v=1736183204669",
  r: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/R.png?v=1736183206018",
  s: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/S.png?v=1736183207635",
  t: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/T.png?v=1736183209283",
  x: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/X.png?v=1736183210905",
  y: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/Y.png?v=1736183212509",
  i: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/E.png?v=1736183901862",
  v: "https://cdn.glitch.global/74da3bde-3b8c-415d-917a-158276350589/V.png?v=1736187662968"
}

const vocalPronounce = {
  a: "ah",
  e: "eh",
  i: "e",
  o: "o",
  u: "ooh",
  y: "i",
  
  ba: "bah",
  be: "beh",
  bi: "b",
  bo: "bo",
  bu: "boo",
  by: "bye",
  
  ga: "gah",
  ge: "geh",
  gi: "ghee",
  go: "go",
  gu: "goo",
  gy: "guy",
  
  ha: "hah",
  he: "heh",
  hi: "he",
  ho: "ho",
  hu: "who",
  hy: "hi",
  
  ka: "kah",
  ke: "kep", // ~~~~~
  ki: "key",
  ko: "co",
  ku: "koo",
  ky: "kye",
  
  ma: "ma",
  me: "meh",
  mi: "me",
  mo: "moh",
  mu: "moo",
  my: "my",
  
  na: "nah",
  ne: "neh",
  ni: "knee",
  no: "no",
  nu: "new",
  ny: "nie",
  
  ra: "rah",
  re: "reh",
  ri: "ree",
  ro: "row",
  ru: "roo",
  ry: "rye",
  
  sa: "saw",
  se: "ceh",
  si: "see",
  so: "so",
  su: "su",
  sy: "sye",
  
  ta: "ta",
  te: "teh", // ~~~~
  ti: "tee",
  to: "toh",
  tu: "to",
  ty: "tie",
  
  va: "vah",
  ve: "veh",
  vi: "v",
  vo: "voh",
  vu: "voo",
  vy: "vaiy",
  
  x1a: "zah",
  x1e: "zehp", // ~~~~
  x1i: "zee",
  x1o: "zo",
  x1u: "zoo",
  x1y: "zyie",
  
  x2a: "cxsah",
  x2e: "cxseh", // ~~~~
  x2i: "cxsee",
  x2o: "csoh",
  x2u: "csoo",
  x2y: "csai",
  
  
  kyt: "kite",
  rak: "rock",
  vos: "voss",
  hik: "heeck",
  bet: "bet",
  rux: "rucks",
  vyb: "vibe",
  tir: "tear",
  x1ar: "zar",
  x2ar: "csar",
  kik: "keek",
  huk: "hoook",
  tyr: "tire"
}

const vowel = "aeiouy";
const consanant = "bcdfghjklmnpqrstvwxz";


function syllableSplit(word) {
  let first = true;

  let syllables = [];
  if (isVowel(word[0])) {
    syllables.push(word[0]);
    word = word.substr(1);
    first = false;
  }
  
  while (word.length > 1) {
    first = false;

    if (word[0] == "x") {
      if (first) syllables.push("x1" + word[1]);
      else       syllables.push("x2" + word[1]);
    } else {
      syllables.push(word[0] + word[1]);
    }
    word = word.substr(2);
  }
  
  if (word.length == 1) syllables[syllables.length - 1] += word;
  
  return syllables;
}

function speak() {
  let breakTime = breakInput.value;
  if (breakTime == -1) {
    breakTime = 99999;
  }
  let speakText = "";
  let syllables = syllableSplit(outputText.value);
  
  let i = 0;
  for (let syllable of syllables) {
    speakText += (vocalPronounce[syllable] ?? "UNKNOWN");
    if (i % breakTime == breakTime - 1) {
      speakText += "; ";
    } else {
      speakText += " ";
    }
    i += 1;
  }
  
  // speakText = "";

  const utterance = new SpeechSynthesisUtterance(speakText);
  utterance.rate = 2.5;
  utterance.pitch = 0.5;
  
  console.log(speakText);

  // const voices = speechSynthesis.getVoices();
  utterance.voice = null;//voices[0];

  speechSynthesis.speak(utterance);
  drawImages();
}

function drawImages() {
  while (outputImages.children.length > 0) outputImages.removeChild(outputImages.children[0]);
  
  for (let letter of outputText.value) {
    const img = new Image();
    img.src = letters[letter];
    img.style.height = "100px";
    img.style.marginLeft = "-15px";
    img.style.marginRight = "-15px";
    img.style.filter = "invert(1)";
    outputImages.appendChild(img);
  }
}

function isVowel(letter) {
  return vowel.indexOf(letter) > -1;
}

function isConstanant(letter) {
  return consanant.indexOf(letter) > -1;
}

function endsWith(word, group) {
  if (!word) return false;
  
  return group.indexOf(word[word.length - 1]) > -1;
}

function startsWith(word, group) {
  if (!word) return false;

  return group.indexOf(word[0]) > -1;
}

function combine(wordA, wordB) {
  if (wordA == "") return wordA + wordB;

  if (endsWith(wordA, vowel)) {
    if (startsWith(wordB, vowel)) {
      return wordA + wordB.substr(1);
    } else {
      if (wordA[wordA.length - 2] == wordB[0]) {
        return wordA.substr(0, wordA.length - 1) + wordB.substr(1);
      }
      return wordA + wordB;
    }
  } else {
    if (startsWith(wordB, vowel)) {
      return wordA + wordB;
    } else {
      return wordA + "a" + wordB;
    }
  }
}

function update() {
  let text = inputText.value.toLowerCase();
  let output = "";
  
  let descriptors;
  let noun;
  
  let splits = text.split(" ").filter(n => n);
  noun = splits.splice(splits.length - 1)[0];
  descriptors = splits;
  
  for (let descriptor of descriptors) {
    if (adjectives[descriptor]) {
      output = combine(output, adjectives[descriptor]);
    } else if (nouns[descriptor]) {
      output = combine(output, nouns[descriptor]);
    } else {
      output = output + "XX";
    }
  }
  
  if (nouns[noun]) {
    output = combine(output, nouns[noun]);
  } else if (adjectives[noun]) {
    output = combine(output, adjectives[noun]);
  } else if (noun) {
    output += "XX";
  }

  outputText.value = output;
  
  drawImages(output);
}