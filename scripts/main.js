import { readYAML } from "./yamlReader.js"; // A helper to read YAML

const customFacesPath = "modules/his-hers-and-theirs-dice/assets/graphics/customFaces";
const customEmissivePath = "modules/his-hers-and-theirs-dice/assets/graphics/emissiveMaps";
const supportedDiceTypes = ["d2", "d3", "d4", "d5", "d6", "d7", "d8", "d10", "d12", "d14", "d16", "d20", "d24", "d30", "d100", "df"];

Hooks.on("diceSoNiceReady", async () => {
  if (!game.dice3d) {
    console.error("HHTD | Dice So Nice! is not available");
    return;
  }

  console.log("HHTD | Dice So Nice! is ready. Registering custom themes...");

  try {
    const themes = await readYAML("modules/his-hers-and-theirs-dice/assets/themes.yaml");

    if (!Array.isArray(themes) || themes.length === 0) {
      console.warn("HHTD | No themes found in themes.yaml");
      return;
    }

    for (const theme of themes) {
      if (!theme.themeName) {
        console.warn("HHTD | Skipping theme with missing themeName");
        continue;
      }

      const themeId = theme.themeName;

      // Register system (base on "default" system)
      game.dice3d.addSystem({ id: themeId, name: themeId }, "default");

      // Register colorset (belongs to the theme's system, not "default")
      game.dice3d.addColorset(
        {
          name: themeId,
          description: `${themeId}'s theme`,
          category: "His, Hers and Theirs Dice",
          foreground: theme.fontColor,
          background: theme.primaryColor,
          edge: theme.edgeColor,
          outline: "#000000",
          texture: theme.texture,
          material: theme.material,
          font: theme.font
        },
        themeId // Register to theme's system, matching the dice presets
      );

      await applyAllDicePresets(theme);
    }

    console.log("HHTD | All custom dice themes and systems have been registered!");
  } catch (error) {
    console.error("HHTD | Failed to register themes:", error);
  }
});

async function applyAllDicePresets(theme) {
  const customFaces = theme.customFaces ?? {};

  for (const type of supportedDiceTypes) {
    const labels = getLabelsForDiceType(type, customFaces);
    const emissiveMaps = await getEmissiveMaps(labels, theme.glowTarget);
    const shape = getShapesForDiceType(type);

    game.dice3d.addDicePreset(
      {
        type,
        labels,
        emissiveMaps,
        emissive: theme.glowColor ?? 0x000000,
        system: theme.themeName,
        colorset: theme.themeName,
        font: theme.font,
        fontScale: getFontScaleForDiceType(type)
      },
      shape
    );
  }
}


function getLabelsForDiceType(type, customFaces = {}) {
  const sequentialFaceCounts = {
    d2: 2,
    d3: 3,
    d4: 4,
    d5: 5,
    d6: 6,
    d7: 7,
    d8: 8,
    d10: 10,
    d12: 12,
    d14: 14,
    d16: 16,
    d20: 20,
    d24: 24,
    d30: 30
  };

  const labels = [];
  const facesForType = customFaces[type] ?? {};

  const getCustomFaceOrNumber = (faceKey) => {
    const candidate = facesForType[faceKey];
    if (candidate) {
      return `${customFacesPath}/${candidate}`;
    }
    return String(faceKey);
  };

  const sequentialCount = sequentialFaceCounts[type];
  if (sequentialCount) {
    for (let face = 1; face <= sequentialCount; face += 1) {
      labels.push(getCustomFaceOrNumber(face));
    }
    return labels;
  }

  if (type === "d100") {
    for (let i = 0; i < 10; i += 1) {
      const value = i === 9 ? "00" : (i + 1) * 10;
      labels.push(getCustomFaceOrNumber(value));
    }
    return labels;
  }

  if (type === "df") {
    labels.push(
      getCustomFaceOrNumber("-"),
      getCustomFaceOrNumber(" "),
      getCustomFaceOrNumber(" "),
      getCustomFaceOrNumber("+"),
      getCustomFaceOrNumber("+"),
      getCustomFaceOrNumber("-")
    );
    return labels;
  }

  return labels;
}


function getShapesForDiceType(type) {
  const shapes = {
    d2: "d2",
    d3: "d6",
    d4: "d4",
    d5: "d10",
    d6: "d6",
    d7: "d14",
    d8: "d8",
    d10: "d10",
    d12: "d12",
    d14: "d14",
    d16: "d16",
    d20: "d20",
    d24: "d24",
    d30: "d30",
    d100: "d10",
    df: "d6",
    dc: "d2"
  };
  return shapes[type] || "d6";
}


async function getEmissiveMaps(labels, glowTarget) {
  if (!glowTarget) {
    return Array(labels.length).fill(null);
  }

  if (glowTarget === "numbers") {
    return labels.map((label) => (label.includes(customFacesPath) ? null : label));
  }

  if (glowTarget === "all") {
    return Promise.all(
      labels.map(async (label) => {
        if (!label.includes(customFacesPath)) {
          return label;
        }
        const emissiveMap = label.replace(customFacesPath, customEmissivePath);
        return (await checkImageExists(emissiveMap)) ? emissiveMap : label;
      })
    );
  }

  if (glowTarget === "faces") {
    return Promise.all(
      labels.map(async (label) => {
        if (!label.includes(customFacesPath)) {
          return null;
        }
        const emissiveMap = label.replace(customFacesPath, customEmissivePath);
        return (await checkImageExists(emissiveMap)) ? emissiveMap : null;
      })
    );
  }

  return Array(labels.length).fill(null);
}


function getFontScaleForDiceType(type) {
  const fontScales = {
    d2: 1.4,
    d3: 1.1,
    d4: 1.0,
    d5: 1.0,
    d6: 1.1,
    d7: 0.7,
    d8: 1.0,
    d10: 1.0,
    d12: 1.1,
    d14: 0.75,
    d16: 0.8,
    d20: 1.0,
    d24: 0.9,
    d30: 0.9,
    d100: 0.75,
    df: 1.2,
    dc: 1.5
  };
  return fontScales[type] || 1.0;
}


// Helper function to check if an image exists
function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(true), { once: true });
    img.addEventListener("error", () => resolve(false), { once: true });
    img.src = imagePath;
  });
}
