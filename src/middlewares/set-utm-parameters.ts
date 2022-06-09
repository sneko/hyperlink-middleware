import { Middleware } from '../middleware';

enum UtmParamEnum {
  Source = 'utm_source',
  Medium = 'utm_medium',
  Campaign = 'utm_campaign',
  Content = 'utm_content',
  Name = 'utm_name',
  Term = 'utm_term',
  InitialSource = 'initial_utm_source',
  InitialMedium = 'initial_utm_medium',
  InitialCampaign = 'initial_utm_campaign',
  InitialContent = 'initial_utm_content',
  InitialName = 'initial_utm_name',
  InitialTerm = 'initial_utm_term',
}

export type UtmParam =
  | UtmParamEnum.Source
  | UtmParamEnum.Medium
  | UtmParamEnum.Campaign
  | UtmParamEnum.Content
  | UtmParamEnum.Name
  | UtmParamEnum.Term
  | UtmParamEnum.InitialSource
  | UtmParamEnum.InitialMedium
  | UtmParamEnum.InitialCampaign
  | UtmParamEnum.InitialContent
  | UtmParamEnum.InitialName
  | UtmParamEnum.InitialTerm;

export interface SetUtmParametersOptions {
  forceIfPresent?: boolean; // By default if any UTM parameter already exists in the clicked hyperlink we do not inject to avoid breaking specific cases, but you can force overriding them
  params: Partial<Record<UtmParam, string>>;
}

/** UTM middleware to inject predefined parameters into links depending on options */
export function SetUtmParametersMiddleware(
  options: SetUtmParametersOptions
): Middleware {
  return (properties, element, next) => {
    let url: URL;
    try {
      url = new URL(properties.href);
    } catch (err) {
      // In case it's not a valid format the middleware is skipped without affecting next ones
      return next();
    }

    const urlParams = url.searchParams;
    let existingUtmParams: boolean = false;

    Object.values(UtmParamEnum).forEach(utmKey => {
      if (urlParams.has(utmKey)) {
        if (
          options.forceIfPresent !== undefined &&
          options.forceIfPresent === true
        ) {
          urlParams.delete(utmKey);
        } else {
          existingUtmParams = true;
        }
      }
    });

    if (!existingUtmParams) {
      for (const [utmKey, utmValue] of Object.entries(options.params)) {
        urlParams.set(utmKey, utmValue);
      }
    }

    properties.href = url.toString();

    next();
  };
}
