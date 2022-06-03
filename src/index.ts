// // Cannot use this for now due to constraint for old `node` versions (`globalThis` not available), so we fallback to a permanent polyfill
// if (globalThis && !globalThis.URLPattern) {
//   await import('urlpattern-polyfill');
// }

import 'urlpattern-polyfill';

export * from './middleware';
export * from './watcher';

export * from './middlewares/format-firebase-dynamic-links';
export * from './middlewares/ignore-followings';
export * from './middlewares/set-missing-url-protocol';
export * from './middlewares/set-utm-parameters';
export * from './wrappers/filter';
