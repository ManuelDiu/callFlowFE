module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', ["next/babel", { "preset-react": { runtime: "automatic" } }]],
  plugins: [
    "babel-plugin-macros",
    ["babel-plugin-styled-components", { ssr: true }],
  ],
};