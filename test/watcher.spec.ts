import { HyperlinkWatcher, Middleware, MiddlewareComposition } from '../src';

describe('HyperlinkWatcher', () => {
  let hyperlinkWatcher: HyperlinkWatcher;

  const mdw: Middleware = (properties, element, next) => {
    const url = new URL(properties.href);
    url.hash = 'custom';
    properties.href = url.toString();
    next();
  };
  const mdwComposition = new MiddlewareComposition(mdw);

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <a id="main-link" href="https://example.com">Hey</a>
        <a class="specific" href="https://specific.com"></a>
        <a id="skipped-link" data-skip-middlewares href="https://skipped.com"></a>
        <a class="custom-do-not-use-middlewares" href="https://skipped.com"></a>
        <a href="https://parent.com">
          <div id="nested-clickable-block"></div>
        </a>
        <a id="anchor-link" href="#specific-page">Hey</a>
        <a id="new-tab-link" href="https://example.com" target="_blank">Hey</a>
      </div>
    `;

    hyperlinkWatcher = new HyperlinkWatcher({
      composition: mdwComposition,
    });
  });

  afterEach(() => {
    hyperlinkWatcher.unwatch();
  });

  it('should detect the element link before performing other tests', () => {
    const hyperlink = document.querySelector('#main-link') as HTMLAnchorElement;

    expect(hyperlink.href).toBe('https://example.com/');
  });

  it('should catch the click in a hyperlink present before the init', () => {
    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const hyperlink = document.querySelector('#main-link') as HTMLAnchorElement;
    hyperlink.click();

    expect(window.open).toHaveBeenLastCalledWith(
      'https://example.com/#custom',
      '_self'
    );
  });

  it('should catch the click in a hyperlink added after the init', async () => {
    const link = document.createElement('a');
    link.id = 'dynamic-link';
    link.innerHTML = 'It is a test.';
    link.target = '_blank';
    link.href = 'https://observer.com';

    // Put the link in nested blocks because the DOM observer will react by block (not per element)
    const divParent = document.createElement('div');
    divParent.appendChild(link);

    const divParentParent = document.createElement('div');
    divParentParent.appendChild(divParent);

    hyperlinkWatcher.watch();
    window.open = jest.fn();

    document.body.appendChild(divParentParent);

    // Wait a bit for the observer to be called asynchronously so it can add the hyperlink listener
    await new Promise(resolve => setTimeout(resolve, 10));

    const hyperlink = document.querySelector(
      '#dynamic-link'
    ) as HTMLAnchorElement;
    hyperlink.click();

    expect(window.open).toHaveBeenLastCalledWith(
      'https://observer.com/#custom',
      '_blank'
    );
  });

  it('should catch nothing since unwatched', () => {
    hyperlinkWatcher.watch();
    hyperlinkWatcher.unwatch();
    window.open = jest.fn();

    const hyperlink = document.querySelector('#main-link') as HTMLAnchorElement;
    hyperlink.click();

    expect(window.open).not.toHaveBeenCalled();
  });

  it('should only work on specific separator', () => {
    hyperlinkWatcher = new HyperlinkWatcher({
      selector: 'a.specific',
      composition: mdwComposition,
    });

    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const mainHyperlink = document.querySelector(
      '#main-link'
    ) as HTMLAnchorElement;
    const specificHyperlink = document.querySelector(
      '.specific'
    ) as HTMLAnchorElement;

    mainHyperlink.click();
    expect(window.open).not.toHaveBeenCalled();

    specificHyperlink.click();
    expect(window.open).toHaveBeenLastCalledWith(
      'https://specific.com/#custom',
      '_self'
    );
  });

  it('should skip hyperlinks tagged with the default data attribute "to skip"', () => {
    hyperlinkWatcher = new HyperlinkWatcher({
      composition: mdwComposition,
    });

    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const skippedHyperlink = document.querySelector(
      '#skipped-link'
    ) as HTMLAnchorElement;

    skippedHyperlink.click();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should skip hyperlinks tagged with the custom selector "to skip"', () => {
    hyperlinkWatcher = new HyperlinkWatcher({
      selector: 'a:not(.custom-do-not-use-middlewares)',
      composition: mdwComposition,
    });

    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const skippedHyperlink = document.querySelector(
      '.custom-do-not-use-middlewares'
    ) as HTMLAnchorElement;

    skippedHyperlink.click();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should manage the hyperlink even if the clicked element is nested', () => {
    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const nestedElement = document.querySelector(
      '#nested-clickable-block'
    ) as HTMLAnchorElement;

    nestedElement.click();
    expect(window.open).toHaveBeenLastCalledWith(
      'https://parent.com/#custom',
      '_self'
    );
  });

  it('should not handle the hyperlink action if no change with middlewares', () => {
    const mdw: Middleware = (properties, element, next) => {
      try {
        new URL(properties.href);
      } catch (err) {
        // In case it's not a valid format the middleware is skipped without affecting next ones
      }

      next();
    };
    const mdwComposition = new MiddlewareComposition(mdw);

    hyperlinkWatcher = new HyperlinkWatcher({
      composition: mdwComposition,
    });

    hyperlinkWatcher.watch();
    window.open = jest.fn();

    const hyperlink = document.querySelector(
      '#anchor-link'
    ) as HTMLAnchorElement;

    hyperlink.click();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should use a workaround when an ad blocker prevents opening a new tab', async () => {
    hyperlinkWatcher = new HyperlinkWatcher({
      composition: mdwComposition,
    });

    hyperlinkWatcher.watch();

    window.open = jest.fn((): Window | null => {
      return { closed: true } as Window;
    });

    const newTabHyperlink = document.querySelector(
      '#new-tab-link'
    ) as HTMLAnchorElement;

    newTabHyperlink.click();

    // [WORKAROUND] For any reason JSDOM is complaining when using the `setTimeout()` in a click event and logs a lot of errors
    // that does not break the test, so temporary we silent the `console.error` :) ... sorry about that but I didn't find a way to make it working!
    // Refs:
    // - https://github.com/jsdom/jsdom/issues/2112
    // - https://github.com/facebook/jest/issues/5266
    const oldConsoleError = console.error;
    console.error = jest.fn();

    await new Promise(resolve => setTimeout(resolve, 200));

    console.error = oldConsoleError;

    expect(window.open).toHaveBeenLastCalledWith(
      'https://example.com/#custom',
      '_self'
    );
  });
});
