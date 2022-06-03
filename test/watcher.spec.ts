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
});
