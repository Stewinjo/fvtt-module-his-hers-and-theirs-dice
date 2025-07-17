import { readYAML } from "./yamlReader.js"; // A helper to read YAML

const customFacesPath = "modules/his-hers-and-theirs-dice/assets/graphics/customFaces"
const customEmissivePath = "modules/his-hers-and-theirs-dice/assets/graphics/emissiveMaps"

Hooks.on('diceSoNiceReady', async function () {
  console.log("HHTD | Dice So Nice! is ready. Registering custom themes...");

  const themes = await readYAML("modules/his-hers-and-theirs-dice/assets/themes.yaml"); // Import theme definitions

  for (const theme of themes) {
    game.dice3d.addSystem({ id: theme.themeName, name: theme.themeName }, "default");

    game.dice3d.addColorset({
      name: theme.themeName,
      description: `${theme.themeName}' theme`,
      category: "His, Hers and Theirs Dice",
      foreground: theme.fontColor,
      background: theme.primaryColor,
      edge: theme.edgeColor,
      outline: "#000000",
      texture: theme.texture,
      material: theme.material,
      font: theme.font
    }, "default");

    await applyAllDicePresets(theme);
  }

  console.log("HHTD | All custom dice themes and systems have been registered!");
});

async function applyAllDicePresets(theme) {
  const diceTypes = ["d2", "d3", "d4", "d5", "d6", "d7", "d8", "d10", "d12", "d14", "d16", "d20", "d24", "d30", "d100", "df"];
  for (const type of diceTypes) {
    const labels = getLabelsForDiceType(type, theme.customFaces);
    const emissiveMaps = theme.glowTarget ? await getEmissiveMaps(labels, theme.customFaces, theme.glowTarget) : Array(labels.length).fill(null);
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
  }
}

function getLabelsForDiceType(type, customFaces) {
  const labels = [];

  // Helper function inside the function
  function getCustomFaceOrNumber(i) {
    return customFaces[type]?.[i] ? `${customFacesPath}/${customFaces[type][i]}` : i.toString();
  }

  switch (type) {
    case "d2":
      labels.push(getCustomFaceOrNumber(1), getCustomFaceOrNumber(2));
      break;

    case "d3":
      for (let i = 1; i <= 3; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d4":
      for (let i = 1; i <= 4; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d5":
      for (let i = 1; i <= 5; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d6":
      for (let i = 1; i <= 6; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d7":
      for (let i = 1; i <= 7; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d8":
      for (let i = 1; i <= 8; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d10":
      for (let i = 1; i <= 10; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d12":
      for (let i = 1; i <= 12; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d14":
      for (let i = 1; i <= 14; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d16":
      for (let i = 1; i <= 16; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d20":
      for (let i = 1; i <= 20; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d24":
      for (let i = 1; i <= 24; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d30":
      for (let i = 1; i <= 30; i++) {
        labels.push(getCustomFaceOrNumber(i));
      }
      break;

    case "d100":
      for (let i = 0; i < 10; i++) {
        const value = i === 9 ? "00" : (i + 1) * 10;
        labels.push(getCustomFaceOrNumber(value));
      }
      break;

    case "df":
      labels.push(
        getCustomFaceOrNumber("-"),
        getCustomFaceOrNumber(" "),
        getCustomFaceOrNumber(" "),
        getCustomFaceOrNumber("+"),
        getCustomFaceOrNumber("+"),
        getCustomFaceOrNumber("-")
      );
      break;

    default:
      return labels // Dont need fallback
  }
  return labels
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

async function getEmissiveMaps(labels, customFaces, glowTarget) {
  switch (glowTarget) {
    case "all":
      return Promise.all(labels.map(async label => {
        if (label.includes(customFacesPath)) {
          const emissiveMap = label.replace(customFacesPath, customEmissivePath);
          return (await checkImageExists(emissiveMap)) ? emissiveMap : label;
        }
        return label; // Non-custom faces remain unchanged
      }));

    case "numbers":
      return labels.map(label =>
        label.includes(customFacesPath) ? null : label // Only numbers glow
      );

    case "faces":
      return Promise.all(labels.map(async label => {
        if (label.includes(customFacesPath)) {
          const emissiveMap = label.replace(customFacesPath, customEmissivePath);
          return (await checkImageExists(emissiveMap)) ? emissiveMap : label;
        }
        return null; // Other faces get no emissive map
      }));

    default:
      return Array(labels.length).fill(null); // No emissive maps
  }
}

function getFontScaleForDiceType(type) {
  const fontScales = {
    "d2": 1.4,
    "d3": 1.1,
    "d4": 1.0,
    "d5": 1.0,
    "d6": 1.1,
    "d7": 0.7,
    "d8": 1.0,
    "d10": 1.0,
    "d12": 1.1,
    "d14": 0.75,
    "d16": 0.8,
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
