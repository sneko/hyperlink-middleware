import { Middleware } from '../middleware';

export interface IgnoreFollowingsOptions {
  applyPatterns?: URLPattern[];
  skipPatterns?: URLPattern[];
}

/** Depending on parameters rules will not call the following chained middlewares */
export function IgnoreFollowingsMiddleware(
  options?: IgnoreFollowingsOptions
): Middleware {
  return (properties, element, next) => {
    if (options) {
      let shouldApply = false;

      if (options.applyPatterns) {
        for (const pattern of options.applyPatterns) {
          if (pattern.test(properties.href)) {
            shouldApply = true;
            break;
          }
        }
      } else {
        shouldApply = true;
      }

      if (options.skipPatterns) {
        for (const pattern of options.skipPatterns) {
          if (pattern.test(properties.href)) {
            shouldApply = false;
            break;
          }
        }
      }

      if (shouldApply) {
        next();
      }

      return;
    }

    next();
  };
}
