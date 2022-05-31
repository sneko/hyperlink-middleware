# Class: MiddlewareComposition

Its instance allows you to chain middlewares

## Table of contents

### Constructors

- [constructor](MiddlewareComposition.md#constructor)

### Methods

- [add](MiddlewareComposition.md#add)
- [apply](MiddlewareComposition.md#apply)
- [applyToLink](MiddlewareComposition.md#applytolink)

## Constructors

### constructor

• **new MiddlewareComposition**(...`mdws`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...mdws` | [`Middleware`](../TYPINGS.md#middleware)[] |

#### Defined in

[middleware.ts:19](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L19)

## Methods

### add

▸ **add**(`mdw`): `void`

Allow adding middleware after initialization

#### Parameters

| Name | Type |
| :------ | :------ |
| `mdw` | [`Middleware`](../TYPINGS.md#middleware) |

#### Returns

`void`

#### Defined in

[middleware.ts:24](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L24)

___

### apply

▸ **apply**(`properties`, `element?`): [`HyperlinkProperties`](../interfaces/HyperlinkProperties.md)

Pass the parameters through the middlewares chain

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | [`HyperlinkProperties`](../interfaces/HyperlinkProperties.md) |
| `element?` | `Element` |

#### Returns

[`HyperlinkProperties`](../interfaces/HyperlinkProperties.md)

#### Defined in

[middleware.ts:29](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L29)

___

### applyToLink

▸ **applyToLink**(`href`): `string`

Pass a link through the middlewares chain. This usage is likely to be used when you do not deal with the HTML DOM, for example when you redirect a user within a framework without any anchor tag (`<a ...></a>`)

Note: if any of the middleware is trying to deal with the anchor element, it will be ignored

#### Parameters

| Name | Type |
| :------ | :------ |
| `href` | `string` |

#### Returns

`string`

#### Defined in

[middleware.ts:73](https://github.com/sneko/hyperlink-middleware/blob/main/src/middleware.ts#L73)
