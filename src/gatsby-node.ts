const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { defaults } = require("./defaults");

const postCssLoader = "postcss-loader";
const cssLoader = "typings-for-css-modules-loader";

exports.modifyWebpackConfig = ({ config, stage }, options) => {
  config.removeLoader("cssModules");

  const cssFiles = /\.module\.css$/;
  const configuration = JSON.stringify({
    ...defaults,
    ...options,
  });
  const loader = `${cssLoader}?${configuration}`;

  switch (stage) {
    case "develop": {
      config.loader("cssModules", {
        test: cssFiles,
        loaders: ["style-loader", loader, postCssLoader],
      });

      return config;
    }
    case "build-css": {
      config.loader("cssModules", {
        test: cssFiles,
        loader: ExtractTextPlugin.extract("style-loader", [
          loader,
          postCssLoader,
        ]),
      });

      return config;
    }
    case "develop-html":
    case "build-html":
    case "build-javascript": {
      config.loader("cssModules", {
        test: cssFiles,
        loader: ExtractTextPlugin.extract("style-loader", [
          loader,
          postCssLoader,
        ]),
      });

      return config;
    }
    default: {
      return config;
    }
  }
};
