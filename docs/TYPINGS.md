# hyperlink-middleware _([show presentation](../README.md))_

## Table of contents

### Classes

- [HyperlinkWatcher](classes/HyperlinkWatcher.md)
- [MiddlewareComposition](classes/MiddlewareComposition.md)

### Interfaces

- [HyperlinkProperties](interfaces/HyperlinkProperties.md)
- [HyperlinkWatcherInputOptions](interfaces/HyperlinkWatcherInputOptions.md)
- [HyperlinkWatcherOptions](interfaces/HyperlinkWatcherOptions.md)

### Type Aliases

- [Middleware](TYPINGS.md#middleware)
- [MiddlewareNext](TYPINGS.md#middlewarenext)

### Functions

- [getDefaultHyperlinkWatcherOptions](TYPINGS.md#getdefaulthyperlinkwatcheroptions)

## Type Aliases

### Middleware

Ƭ **Middleware**: (`properties`: [`HyperlinkProperties`](interfaces/HyperlinkProperties.md), `element`: `Node` \| ``null``, `next`: [`MiddlewareNext`](TYPINGS.md#middlewarenext)) => `void`

#### Type declaration

▸ (`properties`, `element`, `next`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | [`HyperlinkProperties`](interfaces/HyperlinkProperties.md) |
| `element` | `Node` \| ``null`` |
| `next` | [`MiddlewareNext`](TYPINGS.md#middlewarenext) |

##### Returns

`void`

#### Defined in

[middleware.ts:9](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L9)

___

### MiddlewareNext

Ƭ **MiddlewareNext**: (`properties?`: [`HyperlinkProperties`](interfaces/HyperlinkProperties.md)) => `void`

#### Type declaration

▸ (`properties?`): `void`

Middleware interface to respect to chain middleware in a composition

##### Parameters

| Name | Type |
| :------ | :------ |
| `properties?` | [`HyperlinkProperties`](interfaces/HyperlinkProperties.md) |

##### Returns

`void`

#### Defined in

[middleware.ts:8](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L8)

## Functions

### getDefaultHyperlinkWatcherOptions

▸ **getDefaultHyperlinkWatcherOptions**(): [`HyperlinkWatcherOptions`](interfaces/HyperlinkWatcherOptions.md)

#### Returns

[`HyperlinkWatcherOptions`](interfaces/HyperlinkWatcherOptions.md)

#### Defined in

[watcher.ts:15](https://github.com/sneko/hyperlink-middleware/blob/main/src/watcher.ts#L15)
