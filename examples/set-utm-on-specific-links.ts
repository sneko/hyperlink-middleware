import {
  FilterWrapper,
  HyperlinkWatcher,
  MiddlewareComposition,
  SetUtmParametersMiddleware,
} from 'hyperlink-middleware';

// Init the UTM middleware
const utmMiddleware = SetUtmParametersMiddleware({
  params: {
    utm_source: 'your-website',
    utm_medium: 'referral',
    utm_campaign: 'my-campaign',
  },
});

// Wrap the middleware to make sure we won't set UTM parameters when the hyperlinks target the current website (or others)
const utmMiddlewareWrappedToFilterLinks = FilterWrapper(utmMiddleware, {
  // Below some examples, choose what you want to keep
  skipPatterns: [
    new URLPattern({ hostname: '*.mydomain.com' }), // You can exclude all hyperlinks targeting your subdomains
    new URLPattern({ hostname: 'localhost' }), // You can exclude all hyperlinks targeting localhost (when developing if needed)
    new URLPattern({ hostname: window.location.hostname }), // If you don't have subdomains you can focus on excluding only the current hostnanme
  ],
});

// Use a composition to make the middleware runnable, you can of course chain multiple middlewares in this composition
const composition = new MiddlewareComposition(
  utmMiddlewareWrappedToFilterLinks
);

// Now, if you are in a JavaScript context you can do on your own the transformation manually
function method() {
  const transformedLink = composition.applyToLink('https://example.com');

  // Would open "https://example.com/?utm_source=your-website&utm_medium=referral&utm_campaign=my-campaign"
  window.open(transformedLink);
}

// You can also listen for all clicks on `<a ...></a>` to apply the composition
const watcher = new HyperlinkWatcher({
  composition: composition,
});
watcher.watch();
