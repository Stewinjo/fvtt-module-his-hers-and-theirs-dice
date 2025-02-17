Hooks.on('diceSoNiceReady', async function () {
  console.log("HHTD | Dice So Nice! is ready. Registering custom themes...");

  const themes = [
    {
      themeName: "Detta",
      primaryColor: "#1B1F3B",
      edgeColor: "#C0C0C0",
      fontColor: "#FFFFFF",
      texture: "metal",
      material: "metal",
      font: "Cinzel Decorative",
      customFace: "detta.webp",
      glowColor: 0x8ED1FC,
      glowTarget: "faces"
    },
    {
      themeName: "Flodin",
      primaryColor: "#8B4513",
      edgeColor: "#FFD700",
      fontColor: "#FFFFFF",
      texture: "metal",
      material: "metal",
      font: "Rakkas",
      customFace: "flodin.webp",
      glowColor: 0xFFA500,
      glowTarget: "faces"
    },
    {
      themeName: "Saris",
      primaryColor: "#0A0A0A",
      edgeColor: "#5A3E72",
      fontColor: "#FFFFFF",
      texture: "marble",
      material: "glass",
      font: "Spectral SC",
      customFace: "saris.webp",
      glowColor: 0x5A3E72,
      glowTarget: "faces"
    },
    {
      themeName: "Trista",
      primaryColor: "#A10000",
      edgeColor: "#4D4D4D",
      fontColor: "#FFFFFF",
      texture: "rough",
      material: "pristine",
      font: "Uncial Antiqua",
      customFace: "trista.webp"
    },
    {
      themeName: "Vidya",
      primaryColor: "#2E8B57",
      edgeColor: "#C0C0C0",
      fontColor: "#8ED1FC",
      texture: "wood",
      material: "pristine",
      font: "IM Fell English SC",
      customFace: "vidya.webp",
      glowColor: 0x8ED1FC,
      glowTarget: "faces"
    }
  ];

  for (const theme of themes) {
    game.dice3d.addSystem({ id: theme.themeName, name: theme.themeName }, "default");

    game.dice3d.addColorset({
      name: theme.themeName,
      description: `${theme.themeName}' theme`,
      category: "Custom",
      foreground: theme.fontColor,
      background: theme.primaryColor,
      edge: theme.edgeColor,
      outline: "#000000",
      texture: theme.texture,
      material: theme.material,
      font: theme.font
    }, "default");

    applyAllDicePresets(theme);
  }

  console.log("HHTD | All custom dice themes and systems have been registered!");
});

function applyAllDicePresets(theme) {
  const diceTypes = ["d2", "d3", "d4", "d6", "d8", "d10", "d12", "d14", "d16", "d20", "d24", "d30", "d100", "df"];
  diceTypes.forEach(type => {
    const labels = getLabelsForDiceType(type, theme.customFace);
    const emissiveMaps = theme.glowTarget ? getEmissiveMaps(labels, theme.customFace, theme.glowTarget) : Array(labels.length).fill(null);
    const shape = getShapesForDiceType(type);

    game.dice3d.addDicePreset({
      type: type,
      labels: labels,
      emissiveMaps: emissiveMaps,
      emissive: theme.glowColor || 0x000000,
      system: theme.themeName,
      colorset: theme.themeName,
      font: theme.font,
      fontScale: getFontScaleForDiceType(type)
    }, shape);
  });
}

function getLabelsForDiceType(type, customFace) {
  switch (type) {
    case "d2": return ["1", `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    case "d3": return ["1", "2", "2", "3", "3", "1"];
    case "d4": return Array(8).fill().map((_, i) => (i + 1).toString());
    // - WIP - case "d5": return ["1", "2", "3", "4", "5", "1", "2", "3", "4", "5"];
    case "d6": return ["1", "2", "3", "4", "5", `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    // - WIP - case "d7": return ["1", "2", "3", "4", "5", "6", "7", "1", "2", "3", "4", "5", "6", "7"];
    case "d8": return Array(8).fill().map((_, i) => (i + 1).toString());
    case "d10": return Array(10).fill().map((_, i) => (i + 1).toString());
    case "d12": return Array(12).fill().map((_, i) => (i + 1).toString());
    case "d14": return Array(14).fill().map((_, i) => (i + 1).toString());
    case "d16": return Array(16).fill().map((_, i) => (i + 1).toString());
    case "d20": return [...Array(19).fill().map((_, i) => (i + 1).toString()), `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    case "d24": return Array(24).fill().map((_, i) => (i + 1).toString());
    case "d30": return Array(30).fill().map((_, i) => (i + 1).toString());
    case "d100": return ["10", "20", "30", "40", "50", "60", "70", "80", "90", "00"];
    case "df": return ["-", " ", " ", "+", "+", "-"];
    default: return Array(6).fill().map((_, i) => (i + 1).toString());
  }
}

function getShapesForDiceType(type) {
  const shapes = {
    "d2": "d2",
    "d3": "d6",
    "d4": "d4",
    "d5": "d10",
    "d6": "d6",
    "d7": "d14",
    "d8": "d8",
    "d10": "d10",
    "d12": "d12",
    "d14": "d14",
    "d16": "d16",
    "d20": "d20",
    "d24": "d24",
    "d30": "d30",
    "d100": "d10",
    "df": "d6",
    "dc": "d2"
  };
  return shapes[type] || "d6";
}

function getEmissiveMaps(labels, customFace, glowTarget) {
  if (glowTarget === "faces") {
    return labels.map(label => {
      if (label === `modules/his-hers-and-theirs-dice/graphics/${customFace}`) {
        // Check if the emissive map exists
        const emissiveMap = `modules/his-hers-and-theirs-dice/graphics/${customFace.replace(/(\.webp|\.png)$/, '_emissive.png')}`;
        return checkImageExists(emissiveMap) ? emissiveMap : label;
      }
      return label;
    });
  } else if (glowTarget === "numbers") {
    return labels;  // This will make all numbers glow
  } else {
    return Array(labels.length).fill(null);  // No emissive maps
  }
}

function getFontScaleForDiceType(type) {
  const fontScales = {
    "d2": 1.5,
    "d3": 1.1,
    "d4": 1.0,
    "d5": 1.1,
    "d6": 1.1,
    "d7": 1.0,
    "d8": 1.0,
    "d10": 1.0,
    "d12": 1.1,
    "d14": 1.0,
    "d16": 1.0,
    "d20": 1.0,
    "d24": 0.9,
    "d30": 0.9,
    "d100": 0.75,
    "df": 1.2,
    "dc": 1.5
  };
  return fontScales[type] || 1.0;
}

// Helper function to check if an image exists
function checkImageExists(imageREDACTEDh) {
  const img = new Image();
  img.src = imageREDACTEDh;
  return new Promise(resolve => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}
