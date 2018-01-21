# react-native-postcss-transformer

Use [PostCSS](https://github.com/postcss/postcss) to transform CSS to [react native style objects](https://facebook.github.io/react-native/docs/style.html).

> This transformer can be used together with [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules).

## Usage

### Step 1: Install

```sh
yarn add --dev react-native-postcss-transformer postcss
```

### Step 2: Add your PostCSS config

Add your PostCSS configuration to [one of the supported config formats](https://github.com/michael-ciniawsky/postcss-load-config), e.g. `package.json`, `.postcssrc`, `postcss.config.js`, etc.

### Step 3: Configure the react native packager

Add this to your `rn-cli.config.js` (make one to your project's root if you don't have one already):

```js
module.exports = {
  getTransformModulePath() {
    return require.resolve("./postcss-transformer.js");
  },
  getSourceExts() {
    return ["css"]; // <-- Add other extensions if needed.
  }
};
```

Create `postcss-transformer.js` file to your project's root and specify supported extensions:

```js
// For React Native version 0.52 or later
var upstreamTransformer = require("metro/src/transformer");

// For React Native version 0.47-0.51
// var upstreamTransformer = require("metro-bundler/src/transformer");

// For React Native version 0.46
// var upstreamTransformer = require("metro-bundler/build/transformer");

var postcssTransformer = require("react-native-postcss-transformer");
var postCSSExtensions = ["css"]; // <-- Add other extensions if needed.

module.exports.transform = function({ src, filename, options }) {
  if (postCSSExtensions.some(ext => filename.endsWith("." + ext))) {
    return postcssTransformer.transform({ src, filename, options });
  } else {
    return upstreamTransformer.transform({ src, filename, options });
  }
};
```

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
  }
};
```

You can then use that style object with an element:

```jsx
<MyElement style={styles.myClass} />
```
