import { Middleware } from '../middleware';

export interface FilterPatterns {
  applyPatterns?: URLPattern[]; // Include rules
  skipPatterns?: URLPattern[]; // Exclude rules
}

export type FilterWrapperOptions = FilterPatterns;

/** Helper to let it pass or not depending on the hyperlink input */
export function isHyperlinkAllowed(
  href: string,
  filters: FilterPatterns
): boolean {
  let shouldApply = false;

  if (filters.applyPatterns) {
    for (const pattern of filters.applyPatterns) {
      if (pattern.test(href)) {
        shouldApply = true;
        break;
      }
    }
  } else {
    shouldApply = true;
  }

  if (filters.skipPatterns) {
    for (const pattern of filters.skipPatterns) {
      if (pattern.test(href)) {
        shouldApply = false;
        break;
      }
    }
  }

  return shouldApply;
}

/** The wrapper to filter middlewares helps applying or not the passed middleware depending on the hyperlink matching the conditions */
export function FilterWrapper(
  middleware: Middleware,
  options: FilterWrapperOptions
): Middleware {
  return (properties, element, next) => {
    if (
      isHyperlinkAllowed(properties.href, {
        applyPatterns: options.applyPatterns,
        skipPatterns: options.skipPatterns,
      })
    ) {
      // The underlying middleware will be responsible to call `next()` if appropriate
      middleware(properties, element, next);
    } else {
      next();
    }
  };
}
