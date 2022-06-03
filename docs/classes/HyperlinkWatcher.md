# Class: HyperlinkWatcher

Its instance allows you to chain middlewares

## Table of contents

### Constructors

- [constructor](HyperlinkWatcher.md#constructor)

### Methods

- [unwatch](HyperlinkWatcher.md#unwatch)
- [watch](HyperlinkWatcher.md#watch)

## Constructors

### constructor

• **new HyperlinkWatcher**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`HyperlinkWatcherInputOptions`](../interfaces/HyperlinkWatcherInputOptions.md) |

#### Defined in

[watcher.ts:28](https://github.com/sneko/hyperlink-middleware/blob/main/src/watcher.ts#L28)

## Methods

### unwatch

▸ **unwatch**(): `void`

Stop watching clicks on DOM hyperlinks (useful to free memory)

#### Returns

`void`

#### Defined in

[watcher.ts:76](https://github.com/sneko/hyperlink-middleware/blob/main/src/watcher.ts#L76)

___

### watch

▸ **watch**(): `void`

Watch clicks on DOM hyperlinks

Note: this will watch existing hyperlinks when called, but will also manage new hyperlinks added to the DOM

#### Returns

`void`

#### Defined in

[watcher.ts:37](https://github.com/sneko/hyperlink-middleware/blob/main/src/watcher.ts#L37)
