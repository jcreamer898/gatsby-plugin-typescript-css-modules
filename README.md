# Gatsby Plugin Typescript CSS Modules
This [GatsbyJS](gatsbyjs.org) plugin allows for using TypeScript along side CSS Modules.

It requires you to name your css files as `page.module.css`, but from there you can import them into TS files.

```ts
import * as styles from "./page.module.css";
```

The way this works is, under the covers the https://github.com/Jimdo/typings-for-css-modules-loader WebPack plugin reads the CSS file and generates a `.d.ts` file alongside your css.

### Installing
First, install the plugin...

```bash
npm i gatsby-plugin-typescript-css-modules
```

Then, add the plugin to your `gatsby-config.js`...

```js
  // ...
  "gatsby-plugin-typescript-css-modules"
]
```
