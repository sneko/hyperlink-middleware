# Interface: FormatFirebaseDynamicLinksOptions

## Table of contents

### Properties

- [android](FormatFirebaseDynamicLinksOptions.md#android)
- [dynamicLinkBase](FormatFirebaseDynamicLinksOptions.md#dynamiclinkbase)
- [injectUtmParamsInDynamicLink](FormatFirebaseDynamicLinksOptions.md#injectutmparamsindynamiclink)
- [injectUtmParamsInFallback](FormatFirebaseDynamicLinksOptions.md#injectutmparamsinfallback)
- [ios](FormatFirebaseDynamicLinksOptions.md#ios)
- [overrideParams](FormatFirebaseDynamicLinksOptions.md#overrideparams)
- [usePlatformLinkAsFallback](FormatFirebaseDynamicLinksOptions.md#useplatformlinkasfallback)

## Properties

### android

• `Optional` **android**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `storeId` | `string` |
| `storeLink?` | `string` |

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:44](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L44)

___

### dynamicLinkBase

• **dynamicLinkBase**: `string`

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:43](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L43)

___

### injectUtmParamsInDynamicLink

• `Optional` **injectUtmParamsInDynamicLink**: `boolean`

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:55](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L55)

___

### injectUtmParamsInFallback

• `Optional` **injectUtmParamsInFallback**: `boolean`

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:56](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L56)

___

### ios

• `Optional` **ios**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `nativeScheme?` | `string` |
| `skipAppPreviewPage?` | `string` |
| `storeId` | `string` |
| `storeLink?` | `string` |

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:48](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L48)

___

### overrideParams

• `Optional` **overrideParams**: `Partial`<`Record`<[`DynamicLinkParam`](../TYPINGS.md#dynamiclinkparam), `string`\>\>

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:58](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L58)

___

### usePlatformLinkAsFallback

• `Optional` **usePlatformLinkAsFallback**: `boolean`

#### Defined in

[middlewares/format-firebase-dynamic-links.ts:57](https://github.com/sneko/hyperlink-middleware/blob/main/src/middlewares/format-firebase-dynamic-links.ts#L57)
