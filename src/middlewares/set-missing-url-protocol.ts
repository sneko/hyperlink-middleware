import { Middleware } from '../middleware';

export interface SetMissingUrlProtocolOptions {
  defaultProtocol?: string; // In case we are not in a "browser" it may help using a default protocol
}

/** If the hyperlink URL starts with `//` (like `//example.com`) it means the browser will in all case try to use the current protocol.
 *
 * This middleware adds the protocol to the URL to facilicate the next middlewares that in majority use `new URL()` that would fail without a protocol
 *
 * Reminder: it's not advised to use this because if the HTML file is saved locally and open with the `file://` protocol, the link would not work
 */
export function SetMissingUrlProtocolMiddleware(
  options?: SetMissingUrlProtocolOptions
): Middleware {
  return (properties, element, next) => {
    if (properties.href.startsWith('//')) {
      let protocol: string | null = null;

      if (window && window.location && window.location.protocol) {
        protocol = window.location.protocol;
      } else if (options && options.defaultProtocol) {
        protocol = `:${options.defaultProtocol}`;
      }

      if (protocol) {
        properties.href = `${protocol}${properties.href}`;
      }
    }

    next();
  };
}
