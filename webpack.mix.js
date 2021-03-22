let mix = require("laravel-mix");
require("mix-tailwindcss");
require("dotenv").config();

mix.webpackConfig({
  resolve: {
    modules: ["node_modules"],
  },
});

mix.js("app/scripts/vendor.js", "assets").setPublicPath("assets");

mix.js("app/scripts/app.js", "assets").setPublicPath("assets");

mix.sass("app/styles/app.scss", "assets").tailwind().setPublicPath("assets");
