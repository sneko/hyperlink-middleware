import {
  HyperlinkProperties,
  Middleware,
  MiddlewareComposition,
} from '../../src';
import { IgnoreFollowingsMiddleware } from '../../src/middlewares/ignore-followings';

describe('Middlewares', () => {
  let mdwComposition: MiddlewareComposition;
  let initialProperties: HyperlinkProperties;

  beforeEach(() => {
    mdwComposition = new MiddlewareComposition();
    initialProperties = {
      href: 'https://example.com',
      target: '_blank',
    };
  });

  describe('IgnoreFollowingsMiddleware', () => {
    const testMdw: Middleware = (properties, element, next) => {
      properties.href = 'http://pass.com';
      next();
    };

    it('should apply the last middleware', () => {
      mdwComposition.add(
        IgnoreFollowingsMiddleware({
          applyPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );
      mdwComposition.add(testMdw);

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('http://pass.com');
    });

    it('should skip the last middleware', () => {
      mdwComposition.add(
        IgnoreFollowingsMiddleware({
          skipPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );
      mdwComposition.add(testMdw);

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://example.com');
    });

    it('should apply when no option', () => {
      mdwComposition.add(IgnoreFollowingsMiddleware());
      mdwComposition.add(testMdw);

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('http://pass.com');
    });

    it('should skip due since exclusions prevail', () => {
      mdwComposition.add(
        IgnoreFollowingsMiddleware({
          applyPatterns: [new URLPattern({ hostname: 'example.com' })],
          skipPatterns: [new URLPattern({ hostname: 'example.com' })],
        })
      );
      mdwComposition.add(testMdw);

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('https://example.com');
    });
  });
});
