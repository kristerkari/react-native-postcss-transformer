# react-native-postcss-transformer [![NPM version](http://img.shields.io/npm/v/react-native-postcss-transformer.svg)](https://www.npmjs.org/package/react-native-postcss-transformer) [![Downloads per month](https://img.shields.io/npm/dm/react-native-postcss-transformer.svg)](http://npmcharts.com/compare/react-native-postcss-transformer?periodLength=30) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Use [PostCSS](https://github.com/postcss/postcss) to style your React Native apps.

Behind the scenes the PostCSS files are transformed to [react native style objects](https://facebook.github.io/react-native/docs/style.html) (look at the examples).

> This transformer can be used together with [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules).

## How does it work?

Your `App.css` file might look like this (using [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables) plugin):

```css
:root {
  --blue-color: blue;
}

.myClass {
  color: var(--blue-color);
}
.myOtherClass {
  color: red;
}
.my-dashed-class {
  color: green;
}
```

When you import your stylesheet:

```js
import styles from "./App.css";
```

Your imported styles will look like this:

```js
var styles = {
  myClass: {
    color: "blue"
  },
  myOtherClass: {
    color: "red"
  },
  "my-dashed-class": {
    color: "green"
  }
};
```

You can then use that style object with an element:

**Plain React Native:**

```jsx
<MyElement style={styles.myClass} />

<MyElement style={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [className](https://github.com/kristerkari/babel-plugin-react-native-classname-to-style) property:**

```jsx
<MyElement className={styles.myClass} />

<MyElement className={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [styleName](https://github.com/kristerkari/babel-plugin-react-native-stylename-to-style) property:**

```jsx
<MyElement styleName="myClass my-dashed-class" />
```

## Installation and configuration

### Step 1: Install

```sh
npm install --save-dev react-native-postcss-transformer postcss
```

or

```sh
yarn add --dev react-native-postcss-transformer postcss
```

### Step 2: Add your PostCSS config and install your PostCSS plugins

Add your PostCSS configuration to [one of the supported config formats](https://github.com/michael-ciniawsky/postcss-load-config), e.g. `package.json`, `.postcssrc`, `postcss.config.js`, etc.

### Step 3: Configure the react native packager

#### For Expo SDK v41.0.0 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("./postcss-transformer.js")
  };
  config.resolver = {
    ...resolver,
    sourceExts: [...sourceExts, "css", "pcss"]
  };

  return config;
})();
```

---

#### For React Native v0.72.1 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("./postcss-transformer.js")
  },
  resolver: {
    sourceExts: [...sourceExts, "css", "pcss"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
```

### Step 4: Add transformer file

Create `postcss-transformer.js` file to your project's root and specify supported extensions:

```js
const upstreamTransformer = require("@react-native/metro-babel-transformer");
const postcssTransformer = require("react-native-postcss-transformer");
const postCSSExtensions = ["css", "pcss"]; // <-- Add other extensions if needed.

module.exports.transform = function ({ src, filename, ...rest }) {
  if (postCSSExtensions.some((ext) => filename.endsWith("." + ext))) {
    return postcssTransformer.transform({ src, filename, ...rest });
  }
  return upstreamTransformer.transform({ src, filename, ...rest });
};
```

## Dependencies

This library has the following Node.js modules as dependencies:

- [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform)
- [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config)

## TODO

- Find a way to make the configuration cleaner by only having to add `metro.config.js` to a project, https://github.com/kristerkari/react-native-postcss-transformer/issues/1.
