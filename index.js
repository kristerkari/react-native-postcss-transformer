const css2rn = require("css-to-react-native-transform").default;
const postcss = require("postcss");
const postcssrc = require("postcss-load-config");

/**
 * `metro-react-native-babel-transformer` has recently been migrated to the React Native
 * repository and published under the `@react-native/metro-babel-transformer` name.
 * The new package is default on `react-native` >= 0.73.0, so we need to conditionally load it.
 *
 * Additionally, Expo v50.0.0 has begun using @expo/metro-config/babel-transformer as its upstream transformer.
 * To avoid breaking projects, we should prioritze that package if it is available.
 */
const upstreamTransformer = (() => {
  try {
    return require("@expo/metro-config/babel-transformer");
  } catch (error) {
    try {
      return require("@react-native/metro-babel-transformer");
    } catch (error) {
      return require("metro-react-native-babel-transformer");
    }
  }
})();

module.exports.transform = async ({ src, filename, ...rest }) => {
  const ctx = { parser: false, map: "inline", from: undefined };
  return postcssrc(ctx).then((config) => {
    return postcss(config.plugins)
      .process(src, config.options)
      .then((result) => {
        const cssObject = css2rn(result.css, { parseMediaQueries: true });
        return upstreamTransformer.transform({
          src: "module.exports = " + JSON.stringify(cssObject),
          filename,
          ...rest
        });
      });
  });
};
