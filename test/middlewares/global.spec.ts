import {
  HyperlinkProperties,
  Middleware,
  MiddlewareComposition,
} from '../../src';
import { FormatFirebaseDynamicLinksMiddleware } from '../../src/middlewares/format-firebase-dynamic-links';
import { IgnoreFollowingsMiddleware } from '../../src/middlewares/ignore-followings';
import { SetMissingUrlProtocolMiddleware } from '../../src/middlewares/set-missing-url-protocol';
import { SetUtmParametersMiddleware } from '../../src/middlewares/set-utm-parameters';

// Info: there is no way to mock its exported object (since not a function...)
// so we override during tests directly the object while resetting just in case in `afterEach()`
import platform from 'platform';

const platformOsBackup = JSON.parse(JSON.stringify(platform.os));

describe('Middlewares', () => {
  let mdwComposition: MiddlewareComposition;
  let initialProperties: HyperlinkProperties;

  beforeEach(() => {
    mdwComposition = new MiddlewareComposition();
    initialProperties = {
      href: 'https://example.com',
      target: '_blank',
    };

    // Used so modification on it are reset after each test
    platform.os = JSON.parse(JSON.stringify(platformOsBackup));
  });

  describe('SetMissingUrlProtocolMiddleware', () => {
    beforeEach(() => {
      mdwComposition.add(SetMissingUrlProtocolMiddleware());
    });

    it('should set a protocol', () => {
      initialProperties.href = '//example.com';

      const properties = mdwComposition.apply(initialProperties);

      // Since the JSDOM uses `http` by default
      expect(properties.href).toBe('http://example.com');
    });

    it('should not set a protocol', () => {
      initialProperties.href = 'http://example.com';

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('http://example.com');
    });
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

  describe('SetUtmParametersMiddleware', () => {
    it('should skip if invalid URL', () => {
      initialProperties.href = 'pass.com';

      mdwComposition.add(
        SetUtmParametersMiddleware({
          params: {
            utm_source: 'hello',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe('pass.com');
    });

    it('should add UTM parameters', () => {
      mdwComposition.add(
        SetUtmParametersMiddleware({
          params: {
            utm_source: 'hello',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      const url = new URL(properties.href);
      expect(url.searchParams.get('utm_source')).toBe('hello');
    });

    it('should not add UTM parameters', () => {
      initialProperties.href = 'http://pass.com/?utm_source=initial';

      mdwComposition.add(
        SetUtmParametersMiddleware({
          params: {
            utm_source: 'hello',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      const url = new URL(properties.href);
      expect(url.searchParams.get('utm_source')).toBe('initial');
    });

    it('should force adding UTM parameters', () => {
      initialProperties.href =
        'http://pass.com/?utm_source=initial&utm_campaign=test';

      mdwComposition.add(
        SetUtmParametersMiddleware({
          forceIfPresent: true,
          params: {
            utm_source: 'hello',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      const url = new URL(properties.href);
      expect(url.searchParams.get('utm_source')).toBe('hello');
      expect(url.searchParams.get('utm_campaign')).toBeNull();
    });
  });

  describe('FormatFirebaseDynamicLinksMiddleware', () => {
    it('should embed the link with nothing specific (not a valid use case)', () => {
      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
        })
      );

      const properties = mdwComposition.apply(initialProperties);

      expect(properties.href).toBe(
        'http://example.page.link/?link=https%3A%2F%2Fexample.com'
      );
    });

    it('should generate the link with required parameters', () => {
      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
          android: {
            storeId: 'test_android_1',
          },
          ios: {
            bundleId: 'test_ios_1',
            storeId: 'test_ios_2',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);
      const dynamicLink = new URL(properties.href);

      expect(dynamicLink.searchParams.get('link')).toBe('https://example.com');
      expect(dynamicLink.searchParams.get('apn')).toBe('test_android_1');
      expect(dynamicLink.searchParams.get('ibi')).toBe('test_ios_1');
      expect(dynamicLink.searchParams.get('isi')).toBe('test_ios_2');
    });

    it('should generate the link with fallback depending on the platform', () => {
      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
          android: {
            storeId: 'test_android_1',
            storeLink: 'http://android.com/abc',
          },
          ios: {
            bundleId: 'test_ios_1',
            storeId: 'test_ios_2',
            storeLink: 'http://ios.com/abc',
          },
          usePlatformLinkAsFallback: true,
        })
      );

      // Force Android platform
      (platform as any).os.family = 'Android';

      const properties = mdwComposition.apply(initialProperties);
      const dynamicLink = new URL(properties.href);

      // Force iOS platform
      (platform as any).os.family = 'iOS';

      const properties2 = mdwComposition.apply(initialProperties);
      const dynamicLink2 = new URL(properties2.href);

      expect(dynamicLink2.searchParams.get('ofl')).toBe('http://ios.com/abc');
    });

    it('should generate the link with UTM parameters accordingly', () => {
      initialProperties.href =
        'http://example.com/?utm_source=test1&utm_medium=test2&utm_campaign=test3';

      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
          android: {
            storeId: 'test_android_1',
            storeLink: 'http://android.com/abc',
          },
          injectUtmParamsInDynamicLink: true,
          injectUtmParamsInFallback: true,
          usePlatformLinkAsFallback: true,
        })
      );

      // Force Android platform
      (platform as any).os.family = 'Android';

      const properties = mdwComposition.apply(initialProperties);
      const dynamicLink = new URL(properties.href);

      expect(dynamicLink.searchParams.get('utm_source')).toBe('test1');
      expect(dynamicLink.searchParams.get('utm_medium')).toBe('test2');
      expect(dynamicLink.searchParams.get('utm_campaign')).toBe('test3');

      const fallbackUrl = dynamicLink.searchParams.get('ofl');
      expect(fallbackUrl).not.toBeNull();
      const fallbackLink = new URL(fallbackUrl!);

      expect(fallbackLink.searchParams.get('utm_source')).toBe('test1');
      expect(fallbackLink.searchParams.get('utm_medium')).toBe('test2');
      expect(fallbackLink.searchParams.get('utm_campaign')).toBe('test3');
    });

    it('should override specific parameters after generating the link', () => {
      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
          android: {
            storeId: 'test_android_1',
          },
          overrideParams: {
            apn: 'changed',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);
      const dynamicLink = new URL(properties.href);

      expect(dynamicLink.searchParams.get('apn')).toBe('changed');
    });

    it('should skip app preview for iOS', () => {
      mdwComposition.add(
        FormatFirebaseDynamicLinksMiddleware({
          dynamicLinkBase: 'http://example.page.link',
          ios: {
            bundleId: 'test1',
            storeId: 'test2',
            skipAppPreviewPage: '1',
          },
        })
      );

      const properties = mdwComposition.apply(initialProperties);
      const dynamicLink = new URL(properties.href);

      expect(dynamicLink.searchParams.get('efr')).toBe('1');
    });
  });
});
