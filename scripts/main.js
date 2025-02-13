Hooks.on('diceSoNiceReady', async function () {
  console.log("Dice So Nice! is ready. Registering custom themes...");

  const themes = [
    {
      themeName: "Detta",
      primaryColor: "#1B1F3B",
      edgeColor: "#C0C0C0",
      fontColor: "#FFFFFF",
      texture: "metal",
      material: "metal",
      font: "Cinzel Decorative",
      customFace: "detta.png",
      glowColor: 0x8ED1FC,  // Silver-blue glow on numbers
      glowTarget: "numbers"
    },
    {
      themeName: "Vidya",
      primaryColor: "#2C5F2D",
      edgeColor: "#8ED1FC",
      fontColor: "#FFFFFF",
      texture: "wood",
      material: "wood",
      font: "IM Fell English SC",
      customFace: "vidya.png",
      glowColor: 0x00FF00,  // Green glow on edges
      glowTarget: "edges"
    },
    {
      themeName: "Trista",
      primaryColor: "#A10000",
      edgeColor: "#4D4D4D",
      fontColor: "#FFFFFF",
      texture: "rough",
      material: "pristine",
      font: "Uncial Antiqua",
      customFace: "trista.png"  // No glow
    },
    {
      themeName: "Saris",
      primaryColor: "#0A0A0A",
      edgeColor: "#5A3E72",
      fontColor: "#FFFFFF",
      texture: "marble",
      material: "glass",
      font: "Spectral SC",
      customFace: "saris.png",
      glowColor: 0x5A3E72,  // Dark violet glow on the custom face
      glowTarget: "face"
    }
  ];

  for (const theme of themes) {
    game.dice3d.addSystem({ id: theme.themeName, name: theme.themeName }, "default");

    game.dice3d.addColorset({
      name: theme.themeName,
      description: `Custom dice theme for ${theme.themeName}`,
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
    console.log(`Custom Dice Theme "${theme.themeName}" added.`);
  }

  ui.notifications.info("All custom dice themes and systems have been registered!");
});

function applyAllDicePresets(theme) {
  const diceTypes = ["d2", "d4", "d6", "d8", "d10", "d12", "d20", "d100", "coin"];
  diceTypes.forEach(type => {
    const labels = getLabelsForDiceType(type, theme.customFace);
    const emissiveMaps = getEmissiveMaps(labels, theme.customFace, theme.glowTarget);

    // Debugging logs
    console.log(`Applying ${type} for ${theme.themeName}`);
    console.log(`Labels for ${type}:`, labels);
    console.log(`Emissive Maps for ${type}:`, emissiveMaps);

    game.dice3d.addDicePreset({
      type: type,
      labels: labels,
      emissiveMaps: emissiveMaps,
      emissive: theme.glowColor || 0x000000,  // Default to no glow
      system: theme.themeName,
      colorset: theme.themeName,
      font: theme.font,
      fontScale: getFontScaleForDiceType(type)
    }, type);
  });
}

function getLabelsForDiceType(type, customFace) {
  switch (type) {
    case "d2": return ["1", `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    case "d6": return ["1", "2", "3", "4", "5", `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    case "d20": return [...Array(19).fill().map((_, i) => (i + 1).toString()), `modules/his-hers-and-theirs-dice/graphics/${customFace}`];
    case "coin": return [
      `modules/his-hers-and-theirs-dice/graphics/${customFace}`,  // Head side (custom face)
      `modules/his-hers-and-theirs-dice/graphics/wolf-tail.webp`  // Tail side (custom wolf tail texture)
    ];
    default: return Array(10).fill().map((_, i) => (i + 1).toString());
  }
}

function getEmissiveMaps(labels, customFace, glowTarget) {
  if (glowTarget === "face") {
    // Glow only on the custom face
    return labels.map(label => label === `modules/his-hers-and-theirs-dice/graphics/${customFace}` ? label : null);
  } else if (glowTarget === "numbers") {
    // Apply emissive map to all faces (to simulate glowing numbers)
    return labels;
  } else if (glowTarget === "edges") {
    // No emissive map (glow applied to edges via emissive color)
    return Array(labels.length).fill(null);
  } else {
    // Default: No emissive maps
    return Array(labels.length).fill(null);
  }
}

function getFontScaleForDiceType(type) {
  const fontScales = {
    "d2": 1.0,
    "d4": 1.1,
    "d6": 1.3,
    "d8": 1.1,
    "d10": 1.0,
    "d12": 1.1,
    "d20": 1.0,
    "d100": 0.75,
    "coin": 1.0
  };
  return fontScales[type] || 1.0;
}
