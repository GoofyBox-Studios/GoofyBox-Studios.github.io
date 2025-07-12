// Directions
//  7 0 1
//  6   2
//  5 4 3

function rand(min, max) {
  if (Array.isArray(min))
    return min[Math.floor(Math.random() * min.length)];

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function directionOffset(direction) {
  switch (direction) {
    case 0: return { x:  0, y: -1 };
    case 1: return { x:  1, y: -1 };
    case 2: return { x:  1, y:  0 };
    case 3: return { x:  1, y:  1 };
    case 4: return { x:  0, y:  1 };
    case 5: return { x: -1, y:  1 };
    case 6: return { x: -1, y:  0 };
    case 7: return { x: -1, y: -1 };
  }
  
  return { x: 0, y: 0 };
}

function wrap(v, b) {
  if (v < 0) v = b + v;
  
  return v % b;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function generate(data, words) {
  if (words.length == 0) return { output: data, score: 0 };
  
  const newData = deepCopy(data);
  
  for (let tries = 0; tries < 100; tries++) {
    const editData = deepCopy(data);
    
    let score = 0;
    
    const word = words[0];
    const direction = rand(0, 7);
    const offset = directionOffset(direction);
    let x = rand(0, 49);
    let y = rand(0, 49);
    let succeeded = true;

    for (let i = 0; i < word.length; i++) {
      if (editData[y][x] != "*" && editData[y][x] != word[i]) {
        succeeded = false;
        break;
      }
      if (editData[y][x] == word[i]) {
        score++;
      } else {
        editData[y][x] = word[i];
      }
      x = wrap(x + offset.x, 50);
      y = wrap(y + offset.y, 50);
    }
    
    if (succeeded) {
      let { output: output, score: newScore } = generate(editData, words.splice(1));
      
      if (output != false) {
        score += newScore;
        return { output, score };
      }
    }
  }
  
  return { output: false, score: -1 };
}

function formedWord(data, x, y, words) {
  return false;
}

function fill(output, words) {
  if (output == false) return output;
  
  let letters = new Set();
  
  for (let row of output) for (let letter of row) letters.add(letter);
  
  letters.delete("*");
  
  letters = letters.keys().toArray();
  
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      if (output[y][x] != "*") continue;
      let tries = 0;
      do {
        output[y][x] = rand(letters);
        tries++;
      } while (formedWord(output, x, y, words) && tries < 10);
      
      if (tries >= 10) {
        return false;
      }
    }
  }
  
  return output;
}





const words = [
  "Abandonment",
  "Ability",
  "Absence",
  "Acceptance",
  "Accident",
  "Accompanied",
  "Adventure",
  "Aggressive",
  "Agreement",
  "Alien",
  "Alleviate",
  "Ambience",
  "Analysis",
  "Animal",
  "Ancient",
  "Anniversary",
  "Apprehensive",
  "Architecture",
  "Arrangement",
  "Assessment",
  "Athlete",
  "Attention",
  "Attractive",
  "Audience",
  "Awareness",
  "Balance",
  "Believe",
  "Beneficial",
  "Breathe",
  "Brilliant",
  "Calendar",
  "Careful",
  "Caffeine",
  "Celebrate",
  "Centimeter",
  "Challenge",
  "Changeable",
  "Citizen",
  "Clever",
  "Collection",
  "Commonplace",
  "Competence",
  "Considerate",
  "Courage",
  "Creativity",
  "Decision",
  "Defend",
  "Delight",
  "Dependable",
  "Description",
  "Desire",
  "Determination",
  "Difference",
  "Diligence",
  "Disagree",
  "Displace",
  "Distance",
  "Election",
  "Elegance",
  "Element",
  "Elevate",
  "Embrace",
  "Endurance",
  "Engage",
  "Enhance",
  "Enterprise",
  "Environment",
  "Essential",
  "Establish",
  "Evidence",
  "Experience",
  "Excellent",
  "Excuse",
  "Expectation",
  "Existence",
  "Extension",
  "Failure",
  "Feature",
  "Fellowship",
  "Fortune",
  "Friendly",
  "Generalize",
  "Generous",
  "Genuine",
  "Geography",
  "Gesture",
  "Harmless",
  "Heritage",
  "Identify",
  "Impressive",
  "Influence",
  "Intelligence",
  "Invisible",
  "Knowledgeable",
  "Lively",
  "Manageable",
  "Measure",
  "Melodic",
  "Mention",
  "Mentioned"
];
for (let wordId in words) words[wordId] = words[wordId].toLowerCase();

for (let word of words) {
  //console.log(word);
  findWords.value += word + " ";
}

const output = document.getElementById("output");

let data = [];

for (let row = 0; row < 50; row++) data.push("**************************************************".split(""));

let bestScore = -1;
let bestOutput = data;
for (let i = 0; i < 100; i++) {
  const { output, score } = generate(data, words);
  if (score > bestScore) {
    bestScore = score;
    bestOutput = output;
  }
}

console.log(bestScore);

data = fill(bestOutput, words);

if (data == false) {
  output.innerHTML = "Failed to generate";
} else {
  for (let row of data) {
    output.innerHTML += " " + row.join(" ") + "\n";
  }

  output.innerHTML = " " + output.innerHTML.trim();
}