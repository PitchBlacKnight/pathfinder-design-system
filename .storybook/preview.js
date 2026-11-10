// Load order mirrors index.html: fonts, tokens, Figma additions, components, behaviors.
import "../css/pathfinder.fonts.css";
import "../tokens/pathfinder.tokens.css";
import "../tokens/pathfinder.figma-additions.css";
import "../css/pathfinder.css";
import "../js/pathfinder.js";
import "./storybook.css";

const setMode = (name, value) => {
  const root = document.documentElement;
  if (value) root.setAttribute(name, value);
  else root.removeAttribute(name);
};

export default {
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations", ["Tokens", "Typography", "Modes"],
          "Actions", "Inputs", "Display", "Navigation", "Feedback", "Data", "Charts", "AI",
          "Recipes", "Handoff",
        ],
      },
    },
    docs: { toc: true },
  },
  globalTypes: {
    theme: {
      description: "Variable mode: theme (data-theme on html)",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "", title: "Dark (default)" },
          { value: "light", title: "Light" },
          { value: "high-contrast", title: "High contrast" },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: "Variable mode: brand (data-brand on html)",
      toolbar: {
        title: "Brand",
        icon: "star",
        items: [
          { value: "", title: "Avant (default)" },
          { value: "northbeam", title: "Northbeam" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Variable mode: density (data-density on html)",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "", title: "Comfortable (default)" },
          { value: "compact", title: "Compact" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "", brand: "", density: "" },
  decorators: [
    (story, { globals }) => {
      setMode("data-theme", globals.theme);
      setMode("data-brand", globals.brand);
      setMode("data-density", globals.density);
      return story();
    },
  ],
};
