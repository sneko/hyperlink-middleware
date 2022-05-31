/** Middleware interface to respect to chain middleware in a composition */
export interface HyperlinkProperties {
  href: string;
  target: string;
}

/** Middleware interface to respect to chain middleware in a composition */
export type MiddlewareNext = (properties?: HyperlinkProperties) => void;
export type Middleware = (
  properties: HyperlinkProperties,
  element: Node | null, // Allow having the clicked element in case we want to deal with it (modify a class, animate it...)
  next: MiddlewareNext // Used to call the next middleware in the chain
) => void;

/** Its instance allows you to chain middlewares */
export class MiddlewareComposition {
  protected readonly middlewares: Middleware[] = [];

  public constructor(...mdws: Middleware[]) {
    this.middlewares = mdws;
  }

  /** Allow adding middleware after initialization */
  public add(mdw: Middleware): void {
    this.middlewares.push(mdw);
  }

  /** Pass the parameters through the middlewares chain */
  public apply(
    properties: HyperlinkProperties,
    element?: Element
  ): HyperlinkProperties {
    let prevIndex = -1;
    let finalProperties = {
      href: properties.href,
      target: properties.target,
    };

    const runner = (index: number) => {
      if (index <= prevIndex) {
        throw new Error('next() called multiple times');
      }

      prevIndex = index;

      const middleware = this.middlewares[index];

      if (middleware) {
        middleware(
          finalProperties,
          element || null,
          (modifiedProperties?: HyperlinkProperties) => {
            if (modifiedProperties) {
              finalProperties = modifiedProperties;
            }

            return runner(index + 1);
          }
        );
      }
    };

    runner(0);

    return finalProperties;
  }

  /**
   * Pass a link through the middlewares chain. This usage is likely to be used when you do not deal with the HTML DOM, for example when you redirect a user within a framework without any anchor tag (`<a ...></a>`)
   *
   * Note: if any of the middleware is trying to deal with the anchor element, it will be ignored
   */
  public applyToLink(href: string): string {
    return this.apply({
      href,
      target: '',
    }).href;
  }
}
