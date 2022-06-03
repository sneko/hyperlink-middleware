import { MiddlewareComposition } from './middleware';

/** Allow customizing the default behavior */
export interface HyperlinkWatcherInputOptions {
  selector?: string; // Can be used to target specific links with selector rules (e.g. `a[data-example]`, `a.myclass`...)
  composition: MiddlewareComposition;
}

/** Watcher options */
export interface HyperlinkWatcherOptions {
  selector: string;
  composition: MiddlewareComposition;
}

export function getDefaultHyperlinkWatcherOptions(): HyperlinkWatcherOptions {
  return {
    selector: 'a:not([data-skip-middlewares])', // By default all links will be watched except those that force disabling the composition (e.g. `<a href="..." data-skip-middlewares></a>`). It may be helpful in case you use on your own the `onclick='...'` event and you do a manual action. You can override it by using the CSS selector syntax.
    composition: new MiddlewareComposition(),
  };
}

/** Its instance allows you to chain middlewares */
export class HyperlinkWatcher {
  protected readonly options: HyperlinkWatcherOptions;
  protected observer: MutationObserver | null = null;
  protected scopedElementClicked: EventListenerOrEventListenerObject; // Needed so `addEventListener` and `removeEventListener` work as pair

  public constructor(options: HyperlinkWatcherInputOptions) {
    this.options = { ...getDefaultHyperlinkWatcherOptions(), ...options };
    this.scopedElementClicked = this.elementClicked.bind(this);
  }

  /** Watch clicks on DOM hyperlinks
   *
   * Note: this will watch existing hyperlinks when called, but will also manage new hyperlinks added to the DOM
   */
  public watch(): void {
    document.querySelectorAll(this.options.selector).forEach(element => {
      this.watchElementClick(element);
    });

    // Watch the ones that could be added after
    const targetNode = document.body; // We watch in all cases from the top element, and we will filter below (no other choice due to flexible selector option)
    const config = { attributes: false, childList: true, subtree: true };

    const callback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            // Check it's an element
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const addedElement = addedNode as Element;

              // If the added node is concerned
              if (addedElement.matches(this.options.selector)) {
                this.watchElementClick(addedElement);
              }

              // In case the added node has children, we parse all of them because a match can be inside
              addedElement
                .querySelectorAll(this.options.selector)
                .forEach(element => {
                  this.watchElementClick(element);
                });
            }
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  /** Stop watching clicks on DOM hyperlinks (useful to free memory) */
  public unwatch(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    document.querySelectorAll(this.options.selector).forEach(element => {
      element.removeEventListener('click', this.scopedElementClicked, false);
    });
  }

  /** Helper to add listener since called at different places */
  protected watchElementClick(element: Element): void {
    element.addEventListener('click', this.scopedElementClicked, false);
  }

  /** With stop the default click to simulate our how logic with middlewares
   *
   * Note: the structure of this method is a bit different because of a potentiel issue when binding the context (ref: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/unbound-method.md)
   */
  protected elementClicked = (event: Event): void => {
    // Only act if the underlying corresponds to a valid selector we know how to manage
    if (event.target) {
      event.preventDefault();

      const clickedElement = event.target as Element;

      if (clickedElement.nodeName === 'A') {
        const hyperlinkElement = clickedElement as HTMLAnchorElement;

        const finalProperties = this.options.composition.apply(
          {
            href: hyperlinkElement.href,
            target: hyperlinkElement.target,
          },
          hyperlinkElement
        );

        // Default to `_self` otherwise when not specified it will be `_blank`
        const hyperlinkTarget: string =
          finalProperties.target !== '' ? finalProperties.target : '_self';

        window.open(finalProperties.href, hyperlinkTarget);
      }
    }
  };
}
