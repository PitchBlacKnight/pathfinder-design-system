import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Pathfinder 2.0",
    brandUrl: "https://pbk-demos.vercel.app/pathfinder/",
    fontBase: '"Schibsted Grotesk", system-ui, sans-serif',
    fontCode: '"JetBrains Mono", monospace',
    colorPrimary: "#4F8CFF",
    colorSecondary: "#4F8CFF",
    appBg: "#0B1220",
    appContentBg: "#0F172A",
    appBorderColor: "#1E293B",
    barBg: "#0F172A",
    textColor: "#E2E8F0",
  }),
});
