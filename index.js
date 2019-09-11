require("babel-register")({
  presets: ["env"],
  plugins: ["dynamic-import-node"]
});
require("./src/server");
