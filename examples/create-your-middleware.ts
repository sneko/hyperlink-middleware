import { Middleware } from 'hyperlink-middleware';

export interface RandomParameters {
  hello: string;
  example: string;
}

/** This is a dummy example. We used a factory in case the middleware can be generic.
 *
 * You can instantiate the middleware with your own parameters:
 * `const middleware = MyDummyMiddlewareFactory({ hello: '1', example: 'morning' })`
 */
export function MyDummyMiddlewareFactory(
  parameters: RandomParameters
): Middleware {
  return (properties, element, next) => {
    // Do your own logic here
    const url = new URL(properties.href);
    url.hostname = 'test.com';
    url.hash = parameters.example;

    properties.href = url.toString();

    // Must be called so following middlewares are chained
    next();
  };
}

/** You could also directly declare a middleware if you have no logic that depends on the context (like parameters...)
 *
 * You can instantiate the middleware with your own parameters:
 * `const middleware = MyDummyMiddlewareFactory({ hello: '1', example: 'morning' })`
 */
export const MySecondDummyMiddleware: Middleware = (
  properties,
  element,
  next
) => {
  // Do your own logic here
  const url = new URL(properties.href);
  url.hash = 'fixed-hash-forever';

  properties.href = url.toString();

  // Must be called so following middlewares are chained
  next();
};
