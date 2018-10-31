## 3.0.0 (Unreleased)

### New Features

- `DotTip`s can now be made collapsible using the `isCollapsible` prop.

### Breaking Changes

- `DotTip` will no longer automatically position its indicator next to the parent component. Instead, users of `DotTip` should manually position the indicator by applying a `className` or styling `.nux-dot-tip`.

## 2.0.7 (2018-10-29)

### Deprecations

- The `id` prop of `DotTip` has been deprecated. Please use the `tipId` prop instead.

## 2.0.6 (2018-10-22)

## 2.0.5 (2018-10-19)

## 2.0.4 (2018-10-18)

## 2.0.0 (2018-09-05)

### Breaking Changes

- Change how required built-ins are polyfilled with Babel 7 ([#9171](https://github.com/WordPress/gutenberg/pull/9171)).  If you're using an environment that has limited or no support for ES2015+ such as lower versions of IE then using [core-js](https://github.com/zloirock/core-js) or [@babel/polyfill](https://babeljs.io/docs/en/next/babel-polyfill) will add support for these methods.
