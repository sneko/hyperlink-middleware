import { Middleware } from '../middleware';

import platform from 'platform';

/** UTM parameters allowed by Firebase */
enum FirebaseUtmParamEnum {
  Source = 'utm_source',
  Medium = 'utm_medium',
  Campaign = 'utm_campaign',
  Content = 'utm_content',
  Term = 'utm_term',
}

/** Ref: https://firebase.google.com/docs/dynamic-links/create-manually */
export type DynamicLinkParam =
  | 'apn'
  | 'afl'
  | 'amv'
  | 'ibi'
  | 'ifl'
  | 'ius'
  | 'ipfl'
  | 'ipbi'
  | 'isi'
  | 'imv'
  | 'efr'
  | 'ofl'
  | 'st'
  | 'sd'
  | 'si'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'at'
  | 'ct'
  | 'mt'
  | 'pt'
  | 'd';

export interface FormatFirebaseDynamicLinksOptions {
  dynamicLinkBase: string; // E.g. `https://example.page.link`, this comes from Firebase (either their generated URL or a custom domain)
  android?: {
    storeId: string; // E.g. `com.example.app`
    storeLink?: string; // E.g. `https://play.google.com/store/apps/details?id=com.example.app`
  };
  ios?: {
    bundleId: string; // E.g. `com.example.app`
    nativeScheme?: string; // E.g. `example` in case you use deep linking like `example://product?id=123`
    storeId: string; // E.g. `com.example.app`
    storeLink?: string; // E.g. `https://apps.apple.com/us/app/my-app/id0000000000`
    skipAppPreviewPage?: string; // Corresponds to the `efr` parameter. Default `1`
  };
  injectUtmParamsInDynamicLink?: boolean; // The UTM parameters from the hyperlink will be injected into the Dynamic Link. Default `true`
  injectUtmParamsInFallback?: boolean; // The UTM paramaters from the hyperlink will be injected into the fallback. Default `true`
  usePlatformLinkAsFallback?: boolean; // By default the fallback is the hyperlink but we can force using the `ofl` parameter to redirect to the store website. Default `false`
  overrideParams?: Partial<Record<DynamicLinkParam, string>>; // In case you want to use extra parameters of Firebase not yet used in this library you are free to do so in this object
}

/** UTM middleware to inject predefined parameters into links depending on options */
export function FormatFirebaseDynamicLinksMiddleware(
  options: FormatFirebaseDynamicLinksOptions
): Middleware {
  return (properties, element, next) => {
    let url: URL;
    try {
      url = new URL(properties.href);
    } catch (err) {
      // In case it's not a valid format the middleware is skipped without affecting next ones
      return next();
    }

    let androidStoreUrl: URL | undefined;
    let iosStoreUrl: URL | undefined;

    const dynamicLink = new URL(options.dynamicLinkBase);
    dynamicLink.searchParams.set('link', url.toString());

    if (options.android) {
      dynamicLink.searchParams.set('apn', options.android.storeId);

      if (options.android.storeLink) {
        androidStoreUrl = new URL(options.android.storeLink);
      }
    }

    if (options.ios) {
      dynamicLink.searchParams.set('isi', options.ios.storeId);
      dynamicLink.searchParams.set('ibi', options.ios.bundleId);

      if (options.ios.storeLink) {
        iosStoreUrl = new URL(options.ios.storeLink);
      }

      if (options.ios.nativeScheme) {
        dynamicLink.searchParams.set('ius', options.ios.nativeScheme);
      }

      dynamicLink.searchParams.set(
        'efr',
        options.ios.skipAppPreviewPage || '1'
      );
    }

    if (
      options.injectUtmParamsInDynamicLink ||
      options.injectUtmParamsInFallback
    ) {
      const urlParams = url.searchParams;

      // Get UTM parameters from the original link
      Object.values(FirebaseUtmParamEnum).forEach(utmKey => {
        const utmValue = urlParams.get(utmKey);

        if (utmValue) {
          if (options.injectUtmParamsInDynamicLink) {
            dynamicLink.searchParams.set(utmKey, utmValue);
          }

          if (options.injectUtmParamsInFallback) {
            if (androidStoreUrl) {
              androidStoreUrl.searchParams.set(utmKey, utmValue);
            }

            if (iosStoreUrl) {
              iosStoreUrl.searchParams.set(utmKey, utmValue);
            }
          }
        }
      });
    }

    // Fallback link (after UTM manipulations because they can be affected)
    if (options.usePlatformLinkAsFallback !== false) {
      if ((platform as any).os.family === 'iOS' && iosStoreUrl) {
        dynamicLink.searchParams.set('ofl', iosStoreUrl.toString());
      } else if ((platform as any).os.family === 'Android' && androidStoreUrl) {
        dynamicLink.searchParams.set('ofl', androidStoreUrl.toString());
      }
    }

    if (options.overrideParams) {
      for (const [paramKey, paramValue] of Object.entries(
        options.overrideParams
      )) {
        dynamicLink.searchParams.set(paramKey, paramValue);
      }
    }

    properties.href = dynamicLink.toString();

    next();
  };
}
