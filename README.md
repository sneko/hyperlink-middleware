# hyperlink-middleware

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> This package allows modifying on the fly the hyperlink destination without modifying the HTML thanks to middlewares. It includes some middlewares already but you are free to implement your own.
>
> Usage examples:
>
> - Automatically add UTM parameters when a user clicks a hyperlink to a third-party
> - Automatically wrap your links to keep track of the session across browsers flow (this can be done on your own, or by using known services like `Firebase Dynamic Links`, `branch.io`...)
> - Both at same time! (since they are simple middlewares that can be chained)
> - _... there is no limit, depends on your need :)_
>
> Ease of use:
>
> - It does not modify the HTML, so:
>   - the SEO crawlers will reference the right destination link
>   - if the user focuses on the link address or decide to copy it manually he will copy the original link
> - It handles at initialization all the existing hyperlinks (`<a ...></a>` of your HTML), and it will also watch any new hyperlink added after the initialization
> - It can be used within your own framework logic if you are dealing with either custom hyperlinks or JavaScript redirections
> - If you don't access the full source code you could include a remote script in your CMS/blog to set it up, same if you are dealing with tools like `Google Tag Manager`
> - This package may already embeds the middleware you are looking for! If the community adopts/develops a middleware for a common usage, we will do our best to embed it in the library

## Install

With NPM:

```bash
npm install hyperlink-middleware
```

With Yarn:

```bash
yarn add hyperlink-middleware
```

## Usage

```ts
import { HyperlinkWatcher, MiddlewareComposition } from 'hyperlink-middleware';

// Here it's just fake middlewares, import the ones you want to use or create your own
import { MyFirstMiddleware, MySecondMiddleware } from './your-own-middlewares';

// Declare which middlewares you want to chain (the composition can be used directly and without any `HyperlinkWatcher` instance if you don't want to watch HTML hyperlinks, you could use for example `const transformedLink = composition.applyToLink('https://example.com')`)
const composition = new MiddlewareComposition(
  new MyFirstMiddleware(),
  new MySecondMiddleware()
);

// To watch all hyperlinks from the HTML, we use the default watcher
const watcher = new HyperlinkWatcher({
  composition: composition,
});
watcher.watch();
```

_More examples are available in [by clicking here](examples/)_

## Available middlewares inside this library

- ...

_Do not hesitate to share yours so we can add it to the list!_

## Compatibility with custom hyperlinks from frameworks

In case your framework does not use the standard HTML element `<a></a>` it's likely you will have to make the bridge between the framework and this library.

If you do integrate the `MiddlewareComposition` class with a specific framework please do not hesitate to share your work, we may publish it!

## API & documentation

You can find all available methods and definitions [by clicking here](docs/TYPINGS.md)

_Note: this technical documentation is auto-generated_

## Advanced usage

### Development & pull requests

If you are willing to contribute to this library, you can easily watch tests while developing:

```bash
yarn run test:watch
```

In you intend while developing on this library to test directly into a parent project (thanks to `yarn link ...`), you can use the following so modifications are reflected with just a page refresh (it can be used in parallel to the previous command):

```
yarn run dev
```

_Note: in case your "parent project" uses CommonJS it's required to use `yarn run dev:cjs`_

**[IMPORTANT] To develop, and in case your package manager is `npm` you should be able to install dependencies to do some testing... but to submit a pull request please use `yarn` because our dependency tree is managed through `yarn.lock` (and not `package-lock.json` from `npm`).**

Thanks in advance! 🚀
