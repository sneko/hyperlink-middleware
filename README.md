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

### In a Node.js environment

Here a basic example with any middleware that you can chain. It's just to give a taste of what's possible :)

```ts
import {
  HyperlinkWatcher,
  MiddlewareComposition,
  SetUtmParametersMiddleware,
} from 'hyperlink-middleware';

// Here it's just a fake middleware, import the ones you want to use (you can create your own)
import { YourFirstMiddleware } from './your-own-middlewares';

// Declare which middlewares you want to chain
const composition = new MiddlewareComposition(
  new YourFirstMiddleware(),
  new SetUtmParametersMiddleware({
    params: {
      utm_source: 'your-website',
      utm_medium: 'referral',
      utm_campaign: 'my-campaign',
    },
  })
);

// To watch all hyperlinks from the HTML, we use the default watcher
// Note: the composition can be used directly and without any `HyperlinkWatcher` instance if you don't want to watch HTML hyperlinks, you could use for example `const transformedLink = composition.applyToLink('https://example.com')`
const watcher = new HyperlinkWatcher({
  composition: composition,
});
watcher.watch();
```

**For a deeper overview of the usage please have a look at [./examples/set-utm-on-specific-links.ts](./examples/set-utm-on-specific-links.ts).**

_More examples are available into [the example folder](examples/) or into [the test folder](examples/)._

### Included directly in the HTML

If you are just able to append a script to a blog or a CMS, or if you are using Google Tag Manager you could follow this example:

```html
<script src="https://unpkg.com/hyperlink-middleware@latest/dist/umd/index.min.js"></script>
<script>
  var composition = new HyperlinkMiddleware.MiddlewareComposition(
    HyperlinkMiddleware.SetUtmParametersMiddleware({
      params: {
        utm_source: 'your-website',
        utm_medium: 'referral',
        utm_campaign: 'my-campaign',
      },
    })
  );

  var watcher = new HyperlinkMiddleware.HyperlinkWatcher({
    composition: composition,
  });
  watcher.watch();
</script>
```

_Note: adjust the `latest` version if you want to stick to a specific one :)_

## Available middlewares inside this library

- `SetUtmParametersMiddleware(...)`: hyperlinks will be merged with specified UTM parameters. It makes easier tagging all links with parameters that identify your frontend as the origin. **It's likely you would use the `FilterWrapper(...)` to wrap this middleware** to be sure it's not applied on your own website links or other websites of your company that is watched in the same "analytics account property".

- `FormatFirebaseDynamicLinksMiddleware(...)`: allows generating a Firebase Dynamic Link to keep a consistent flow for cross-browsers sessions. You should use it with `FilterWrapper(...)` because the generation should only apply for specific links that are targeting your native application.

- `IgnoreFollowingsMiddleware(...)`: in case you want to stop the middlewares chain based on the hyperlink input. It avoids using multiple `FilterWrapper(...)` with the same rules around all following middlewares

- `SetMissingUrlProtocolMiddleware(...)`: some websites used links starting with `//example.com` so it would probably break following middlewares. This middleware will add a protocol to the links so it does not throw an error in the following middlewares. _It should be used before all other middlewares._

- `FilterWrapper(...)`: it's used to wrap any of the middlewares in this list to specify on which hyperlinks it should apply or not. It uses the new `URLPattern` standard that offers the ease to manage match URLs. Example: `FilterWrapper(yourMiddleware, { applyPatterns: [new URLPattern({ hostname: 'example.com' })]})`

_Do not hesitate to share yours so we can add it to the list!_

## API & documentation

You can find all available methods and definitions [by clicking here](docs/TYPINGS.md)

_Note: this technical documentation is auto-generated_

## Compatibility with custom hyperlinks from frameworks

In case your framework does not use the standard HTML element `<a></a>` it's likely you will have to make the bridge between the framework and this library.

If you do integrate the `MiddlewareComposition` class with a specific framework please do not hesitate to share your work, we may publish it!

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

[build-img]: https://github.com/sneko/hyperlink-middleware/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/sneko/hyperlink-middleware/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/hyperlink-middleware
[downloads-url]: https://www.npmtrends.com/hyperlink-middleware
[npm-img]: https://img.shields.io/npm/v/hyperlink-middleware
[npm-url]: https://www.npmjs.com/package/hyperlink-middleware
[issues-img]: https://img.shields.io/github/issues/sneko/hyperlink-middleware
[issues-url]: https://github.com/sneko/hyperlink-middleware/issues
[codecov-img]: https://codecov.io/gh/sneko/hyperlink-middleware/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/sneko/hyperlink-middleware
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
