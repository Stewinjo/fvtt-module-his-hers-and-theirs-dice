Hooks.once('ready', async function () {
  if (!game.dice3d) {
    console.error("Dice So Nice! is not enabled.");
    return;
  }

  const themes = [
    {
      player: "Carly",
      themeName: "Detta",
      primaryColor: "#1B1F3B",
      edgeColor: "#C0C0C0",
      fontColor: "#FFFFFF",
      texture: "metal",
      material: "metal",
      font: "Cinzel Decorative",
      customFace: "graphics/detta.png"
    },
    {
      player: "Ankur",
      themeName: "Vidya",
      primaryColor: "#2C5F2D",
      edgeColor: "#8ED1FC",
      fontColor: "#FFFFFF",
      texture: "wood",
      material: "wood",
      font: "IM Fell English SC",
      customFace: "graphics/vidya.png"
    },
    {
      player: "Pat",
      themeName: "Trista",
      primaryColor: "#A10000",
      edgeColor: "#4D4D4D",
      fontColor: "#FFFFFF",
      texture: "rough",
      material: "pristine",
      font: "Uncial Antiqua",
      customFace: "graphics/trista.png"
    },
    {
      player: "Steffen",
      themeName: "Saris",
      primaryColor: "#0A0A0A",
      edgeColor: "#5A3E72",
      fontColor: "#FFFFFF",
      texture: "marble",
      material: "glass",
      font: "Spectral SC",
      customFace: "graphics/saris.png"
    },
    {
      player: "Ola",
      themeName: "Flodin",
      primaryColor: "#D2691E",
      edgeColor: "#A9A9A9",
      fontColor: "#FFFFFF",
      texture: "metal",
      material: "glass",
      font: "Rakkas",
      customFace: "graphics/flodin.png"
    }
  ];

  for (const theme of themes) {
    // Register the colorset
    game.dice3d.addColorset({
      name: theme.themeName,
      description: `Custom dice theme for ${theme.player}`,
      category: "Custom",
      foreground: theme.fontColor,
      background: theme.primaryColor,
      edge: theme.edgeColor,
      outline: "#000000",
      texture: theme.texture,
      material: theme.material,
      font: theme.font
    }, "default");

    // Register the d6 dice preset with a custom face for the 6th side
    game.dice3d.addDicePreset({
      type: "d6",
      labels: ["1", "2", "3", "4", "5", theme.customFace],
      colorset: theme.themeName,
      font: theme.font,
      fontScale: 1.3
    }, "d6");

    // Register the d20 dice preset with a custom face for the 20th side
    game.dice3d.addDicePreset({
      type: "d20",
      labels: Array(19).fill().map((_, i) => (i + 1).toString()).concat(theme.customFace),
      colorset: theme.themeName,
      font: theme.font,
      fontScale: 1.0
    }, "d20");

    console.log(`Custom Dice Theme "${theme.themeName}" added for ${theme.player}`);
  }

  ui.notifications.info("All custom dice themes and presets have been registered!");
});
