# hyperlink-middleware _([show presentation](../README.md))_

## Table of contents

### Classes

- [HyperlinkWatcher](classes/HyperlinkWatcher.md)
- [MiddlewareComposition](classes/MiddlewareComposition.md)

### Interfaces

- [FilterPatterns](interfaces/FilterPatterns.md)
- [FormatFirebaseDynamicLinksOptions](interfaces/FormatFirebaseDynamicLinksOptions.md)
- [HyperlinkProperties](interfaces/HyperlinkProperties.md)
- [HyperlinkWatcherInputOptions](interfaces/HyperlinkWatcherInputOptions.md)
- [HyperlinkWatcherOptions](interfaces/HyperlinkWatcherOptions.md)
- [SetMissingUrlProtocolOptions](interfaces/SetMissingUrlProtocolOptions.md)
- [SetUtmParametersOptions](interfaces/SetUtmParametersOptions.md)

### Type Aliases

- [DynamicLinkParam](TYPINGS.md#dynamiclinkparam)
- [FilterWrapperOptions](TYPINGS.md#filterwrapperoptions)
- [IgnoreFollowingsOptions](TYPINGS.md#ignorefollowingsoptions)
- [Middleware](TYPINGS.md#middleware)
- [MiddlewareNext](TYPINGS.md#middlewarenext)
- [UtmParam](TYPINGS.md#utmparam)

### Functions

- [FilterWrapper](TYPINGS.md#filterwrapper)
- [FormatFirebaseDynamicLinksMiddleware](TYPINGS.md#formatfirebasedynamiclinksmiddleware)
- [IgnoreFollowingsMiddleware](TYPINGS.md#ignorefollowingsmiddleware)
- [SetMissingUrlProtocolMiddleware](TYPINGS.md#setmissingurlprotocolmiddleware)
- [SetUtmParametersMiddleware](TYPINGS.md#setutmparametersmiddleware)
- [getDefaultHyperlinkWatcherOptions](TYPINGS.md#getdefaulthyperlinkwatcheroptions)
- [isHyperlinkAllowed](TYPINGS.md#ishyperlinkallowed)

## Type Aliases

### DynamicLinkParam

Ƭ **DynamicLinkParam**: ``"apn"`` \| ``"afl"`` \| ``"amv"`` \| ``"ibi"`` \| ``"ifl"`` \| ``"ius"`` \| ``"ipfl"`` \| ``"ipbi"`` \| ``"isi"`` \| ``"imv"`` \| ``"efr"`` \| ``"ofl"`` \| ``"st"`` \| ``"sd"`` \| ``"si"`` \| ``"utm_source"`` \| ``"utm_medium"`` \| ``"utm_campaign"`` \| ``"utm_term"`` \| ``"utm_content"`` \| ``"at"`` \| ``"ct"`` \| ``"mt"`` \| ``"pt"`` \| ``"d"``

Ref: https://firebase.google.com/docs/dynamic-links/create-manually

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:15](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L15)

___

### FilterWrapperOptions

Ƭ **FilterWrapperOptions**: [`FilterPatterns`](interfaces/FilterPatterns.md)

#### Defined in

[wrappers/filter.ts:8](https://github.com/sneko/hyperlink-middleware/blob/main/src/wrappers/filter.ts#L8)

___

### IgnoreFollowingsOptions

Ƭ **IgnoreFollowingsOptions**: [`FilterPatterns`](interfaces/FilterPatterns.md)

#### Defined in

[middlewares/ignore-followings.ts:4](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/ignore-followings.ts#L4)

___

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

___

### UtmParam

Ƭ **UtmParam**: `UtmParamEnum.Source` \| `UtmParamEnum.Medium` \| `UtmParamEnum.Campaign` \| `UtmParamEnum.Content` \| `UtmParamEnum.Name` \| `UtmParamEnum.Term` \| `UtmParamEnum.InitialSource` \| `UtmParamEnum.InitialMedium` \| `UtmParamEnum.InitialCampaign` \| `UtmParamEnum.InitialContent` \| `UtmParamEnum.InitialName` \| `UtmParamEnum.InitialTerm`

#### Defined in

[middlewares/set-utm-parameters.ts:18](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/set-utm-parameters.ts#L18)

## Functions

### FilterWrapper

▸ **FilterWrapper**(`middleware`, `options`): [`Middleware`](TYPINGS.md#middleware)

The wrapper to filter middlewares helps applying or not the passed middleware depending on the hyperlink matching the conditions

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | [`Middleware`](TYPINGS.md#middleware) |
| `options` | [`FilterPatterns`](interfaces/FilterPatterns.md) |

#### Returns

[`Middleware`](TYPINGS.md#middleware)

#### Defined in

[wrappers/filter.ts:41](https://github.com/sneko/hyperlink-middleware/blob/main/src/wrappers/filter.ts#L41)

___

### FormatFirebaseDynamicLinksMiddleware

▸ **FormatFirebaseDynamicLinksMiddleware**(`options`): [`Middleware`](TYPINGS.md#middleware)

UTM middleware to inject predefined parameters into links depending on options

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`FormatFirebaseDynamicLinksOptions`](interfaces/FormatFirebaseDynamicLinksOptions.md) |

#### Returns

[`Middleware`](TYPINGS.md#middleware)

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:62](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L62)

___

### IgnoreFollowingsMiddleware

▸ **IgnoreFollowingsMiddleware**(`options?`): [`Middleware`](TYPINGS.md#middleware)

Depending on parameters rules will not call the following chained middlewares

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FilterPatterns`](interfaces/FilterPatterns.md) |

#### Returns

[`Middleware`](TYPINGS.md#middleware)

#### Defined in

[middlewares/ignore-followings.ts:7](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/ignore-followings.ts#L7)

___

### SetMissingUrlProtocolMiddleware

▸ **SetMissingUrlProtocolMiddleware**(`options?`): [`Middleware`](TYPINGS.md#middleware)

If the hyperlink URL starts with `//` (like `//example.com`) it means the browser will in all case try to use the current protocol.

This middleware adds the protocol to the URL to facilicate the next middlewares that in majority use `new URL()` that would fail without a protocol

Reminder: it's not advised to use this because if the HTML file is saved locally and open with the `file://` protocol, the link would not work

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SetMissingUrlProtocolOptions`](interfaces/SetMissingUrlProtocolOptions.md) |

#### Returns

[`Middleware`](TYPINGS.md#middleware)

#### Defined in

[middlewares/set-missing-url-protocol.ts:13](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/set-missing-url-protocol.ts#L13)

___

### SetUtmParametersMiddleware

▸ **SetUtmParametersMiddleware**(`options`): [`Middleware`](TYPINGS.md#middleware)

UTM middleware to inject predefined parameters into links depending on options

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SetUtmParametersOptions`](interfaces/SetUtmParametersOptions.md) |

#### Returns

[`Middleware`](TYPINGS.md#middleware)

#### Defined in

[middlewares/set-utm-parameters.ts:38](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/set-utm-parameters.ts#L38)

___

### getDefaultHyperlinkWatcherOptions

▸ **getDefaultHyperlinkWatcherOptions**(): [`HyperlinkWatcherOptions`](interfaces/HyperlinkWatcherOptions.md)

#### Returns

[`HyperlinkWatcherOptions`](interfaces/HyperlinkWatcherOptions.md)

#### Defined in

[watcher.ts:15](https://github.com/sneko/hyperlink-middleware/blob/main/src/watcher.ts#L15)

___

### isHyperlinkAllowed

▸ **isHyperlinkAllowed**(`href`, `filters`): `boolean`

Helper to let it pass or not depending on the hyperlink input

#### Parameters

| Name | Type |
| :------ | :------ |
| `href` | `string` |
| `filters` | [`FilterPatterns`](interfaces/FilterPatterns.md) |

#### Returns

`boolean`

#### Defined in

[wrappers/filter.ts:11](https://github.com/sneko/hyperlink-middleware/blob/main/src/wrappers/filter.ts#L11)
