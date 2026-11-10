/** Pathfinder 2.0 Storybook. Framework: HTML + Vite. The stories import the
 *  real css/, tokens/ and js/ files in this folder, so there is one source. */
export default {
  framework: "@storybook/html-vite",
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.js"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  staticDirs: [{ from: "../fonts", to: "/fonts" }],
  core: { disableTelemetry: true },
};
