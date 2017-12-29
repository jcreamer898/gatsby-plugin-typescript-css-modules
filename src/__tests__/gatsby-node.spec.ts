describe("gatsby-plugin-sass", () => {
  jest.mock("extract-text-webpack-plugin", () => {
    return {
      extract(...args) {
        return { extractTextCalledWithArgs: args };
      },
    };
  });

  const { modifyWebpackConfig } = require("../gatsby-node");
  const { defaults } = require("../defaults");

  const styleLoader = expect.stringMatching(/^style-loader/);
  const postcssLoader = expect.stringMatching(/^postcss-loader/);
  [
    {
      stages: ["develop"],
      loaderKeys: ["cssModules"],
      loaderConfig(cssLoader) {
        return {
          loaders: expect.arrayContaining([
            styleLoader,
            cssLoader,
            postcssLoader,
          ]),
        };
      },
    },
    {
      stages: ["build-css"],
      loaderKeys: ["cssModules"],
      loaderConfig(cssLoader) {
        return {
          loader: {
            extractTextCalledWithArgs: expect.arrayContaining([
              expect.arrayContaining([cssLoader, postcssLoader]),
            ]),
          },
        };
      },
    },
    {
      stages: ["develop-html", "build-html", "build-javascript"],
      loaderKeys: ["cssModules"],
      loaderConfig(cssLoader) {
        return {
          loader: {
            extractTextCalledWithArgs: expect.arrayContaining([
              expect.arrayContaining([cssLoader, postcssLoader]),
            ]),
          },
        };
      },
    },
  ].forEach(({ stages, loaderKeys, loaderConfig }) => {
    stages.forEach(stage => {
      describe("stage: ${stage}", () => {
        [
          {
            options: {},
            cssLoader: `typings-for-css-modules-loader?${JSON.stringify(defaults)}`,
          },
          {
            options: {
              namedExport: false,
              modules: false,
            },
            cssLoader: `typings-for-css-modules-loader?${JSON.stringify({
              ...defaults, ...{
                namedExport: false,
                modules: false,
              }
            })}`,
          },
          {
            options: {
              localIdentName: "[name]---[local]----[hash:base64:5]",
            },
            cssLoader: `typings-for-css-modules-loader?${JSON.stringify({
              ...defaults, ...{
                localIdentName: "[name]---[local]----[hash:base64:5]",
              }
            })}`,
          },
        ].forEach(({ options, cssLoader }) => {
          const stringified = JSON.stringify(options);

          it(`modifies webpack config for ${stringified}`, () => {
            const config = { loader: jest.fn(), removeLoader: jest.fn() };
            const modified = modifyWebpackConfig({ config, stage }, options);

            expect(modified).toBe(config);

            loaderKeys.forEach(loaderKey =>
              expect(config.loader).toBeCalledWith(
                loaderKey,
                expect.objectContaining(loaderConfig(cssLoader)),
              ),
            );
          });
        });
      });
    });
  });
});
