import {
  HyperlinkProperties,
  Middleware,
  MiddlewareComposition,
} from '../../src';
import { FilterWrapper } from '../../src/wrappers/filter';

describe('Wrappers', () => {
  let mdwComposition: MiddlewareComposition;
  let initialProperties: HyperlinkProperties;

  beforeEach(() => {
    mdwComposition = new MiddlewareComposition();
    initialProperties = {
      href: 'https://example.com',
      target: '_blank',
    };
  });

  describe('FilterWrapper', () => {
    const testMdw: Middleware = (properties, element, next) => {
      properties.href = 'https://changed.com';
      next();
    };

    it('should use the underlying middleware', () => {
      mdwComposition.add(
        FilterWrapper(testMdw, {
          applyPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://changed.com');
    });

    it('should skip the underlying middleware', () => {
      mdwComposition.add(
        FilterWrapper(testMdw, {
          skipPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://example.com');
    });

    it('should skip due since exclusions prevail', () => {
      mdwComposition.add(
        FilterWrapper(testMdw, {
          applyPatterns: [new URLPattern({ hostname: 'example.com' })],
          skipPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://example.com');
    });

    it('should not interfer with following middlewares', () => {
      mdwComposition.add(
        FilterWrapper(testMdw, {
          skipPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );
      mdwComposition.add(
        FilterWrapper(testMdw, {
          applyPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://changed.com');
    });
  });
});
