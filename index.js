require("@babel/register")({
  presets: ["@babel/env", "@babel/preset-react"],
  plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-proposal-class-properties"]
});
require("./src/server");
