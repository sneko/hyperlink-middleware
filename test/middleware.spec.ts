import { HyperlinkProperties, Middleware, MiddlewareComposition } from '../src';

describe('MiddlewareComposition', () => {
  let mdwComposition: MiddlewareComposition;
  let initialProperties: HyperlinkProperties;

  const mdwWithoutNext: Middleware = (properties, element, next) => {
    // Not calling `next()` will stop the chain
  };
  const mdwMultipleNext: Middleware = (properties, element, next) => {
    next();
    next();
  };
  const mdw1: Middleware = (properties, element, next) => {
    const url = new URL(properties.href);
    url.hostname = 'test.com';

    properties.href = url.toString();
    properties.target = '_self';
    next();
  };
  const mdw2: Middleware = (properties, element, next) => {
    const url = new URL(properties.href);
    url.hostname = 'change.com';

    next({
      href: url.toString(),
      target: properties.target,
    });
  };

  beforeEach(() => {
    mdwComposition = new MiddlewareComposition();
    initialProperties = {
      href: 'https://example.com',
      target: '_blank',
    };
  });

  it('should apply a middleware', () => {
    mdwComposition.add(mdw1);

    const properties = mdwComposition.apply(initialProperties);

    expect(properties.href).toBe('https://test.com/');
  });

  it('should apply multiple middlewares with different properties assignation', () => {
    mdwComposition.add(mdw1);
    mdwComposition.add(mdw2);

    const properties = mdwComposition.apply(initialProperties);

    expect(properties).toStrictEqual({
      href: 'https://change.com/',
      target: '_self',
    });
  });

  it('should not call subsequent middlewares', () => {
    mdwComposition.add(mdwWithoutNext);
    mdwComposition.add(mdw1);
    mdwComposition.add(mdw2);

    const properties = mdwComposition.apply(initialProperties);

    expect(properties).toStrictEqual({
      href: 'https://example.com',
      target: '_blank',
    });
  });

  it('should multiple next calls throws an error', () => {
    mdwComposition.add(mdwMultipleNext);
    mdwComposition.add(mdw1);
    mdwComposition.add(mdw2);

    expect(() => {
      mdwComposition.apply(initialProperties);
    }).toThrow();
  });
});
