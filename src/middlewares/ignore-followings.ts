import { Middleware } from '../middleware';
import { isHyperlinkAllowed, FilterPatterns } from '../wrappers/filter';

export type IgnoreFollowingsOptions = FilterPatterns;

/** Depending on parameters rules will not call the following chained middlewares */
export function IgnoreFollowingsMiddleware(
  options?: IgnoreFollowingsOptions
): Middleware {
  return (properties, element, next) => {
    if (options) {
      if (
        isHyperlinkAllowed(properties.href, {
          applyPatterns: options.applyPatterns,
          skipPatterns: options.skipPatterns,
        })
      ) {
        return next();
      } else {
        return;
      }
    }

    next();
  };
}
