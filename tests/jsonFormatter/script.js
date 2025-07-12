document.getElementById("formatButton").onclick = function () {
  const input = document.getElementById("jsonInput").value;
  const indentOption = document.getElementById("indentation").value;
  const indent = indentOption === "tab" ? "\t" : " ".repeat(Number(indentOption));
  let formattedJson;

  try {
    const jsonObject = JSON.parse(input);
    formattedJson = format(jsonObject, indent);
    document.getElementById("output").textContent = formattedJson;

  } catch (error) {
    document.getElementById("output").textContent = "Invalid JSON: " + error.message;
  }
};

document.getElementById("copyButton").onclick = function () {
  navigator.clipboard.writeText(document.getElementById("output").textContent);
}

function format(obj, indent, level = 0) {
  if (Array.isArray(obj)) {
    const indentA = indent.repeat(level);
    const indentB = indent.repeat(level + 1);
    
    if (obj.length <= 3 && obj.every(item => (typeof item != "object"))) {
      return "[ " + obj.map(v => format(v)).join(", ") + " ]";
    }
    
    let insides = "";
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      const last = i == obj.length - 1;
      
      insides += format(item, indent, level + 1)
      
      if (!last) insides += ",\n" + indentB;
    }
    
    return "[\n" + indentB + insides + "\n" + indentA + "]";

  } else if (typeof obj === "object" && obj !== null) {
    const indentA = indent.repeat(level);
    const indentB = indent.repeat(level + 1);
    
    if (Object.keys(obj).length == 0) return "{}"
    
    let insides = "";
    let isFirst = true;
    for (let key in obj) {
      const value = obj[key];
      
      if (!isFirst) insides += `,\n${indentB}`;
      
      insides += `"${key}": ${format(value, indent, level + 1)}`;
      
      isFirst = false;
    }
    
    return `{\n${indentB}${insides}\n${indentA}}`;

  } else if (typeof obj === "string") {
    return `"${obj}"`;

  } else {
    return String(obj);

  }
}