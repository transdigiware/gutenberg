# FontSizePicker

FontSizePicker is a React component that renders a UI that allows users to select a font size.
The component renders a series of buttons that allow the user to select predefined (common) font sizes and contains a range slider that enables the user to select custom font sizes (by choosing the value.

## Usage


```jsx
import { FontSizePicker } from '@wordpress/components';
import { withState } from '@wordpress/compose';

...
const MyFontSizePicker = withState( {
	fontSize: 16,
} )( ( { fontSize, setState } ) => {
	const fontSizes = [
		{ name: 'Small', size: 12 },
		{ name: 'Big', size: 26 },
	];
	const fallbackFontSize = 16;

	return (
		<FontSizePicker
			fontSizes={ fontSizes }
			value={ fontSize }
			fallbackFontSize={ fallbackFontSize }
			onChange={ ( newFontSize ) => {
				setState( { fontSize: newFontSize } );
			} }
		/>
	);
} );

...

<MyFontSizePicker />
```

## Props

The component accepts the following props:

### disableCustomFontSizes

If true it will not be possible to choose a custom fontSize, the user will be forced to pick one of the sizes passed in fontSizes.

- Type: `Boolean`
- Required: no
- Default: `false`

### fallbackFontSize

In no value exists this prop contains the font size picker slider starting position. Only relevant if withSlider is true.

- Type: `Number`
- Required: No

### fontSizes

An array of font size objects. The object should contain properties size and name.
The property "size" contains a number with the font size value. The "name" property includes a label for that fontSize e.g: "Small".

- Type: `Array`
- Required: No

### onChange

A function that receives the new font size value.
If onChange is called without any parameter, it should reset the value, attending to what reset means in that context, e.g., set the font size to undefined or set the font size a starting value.

- Type: `function`
- Required: Yes

### value

The current font size value.

- Type: `Number`
- Required: No

### withSlider

If true the UI will contain a slider. If false no slider will be present.

- Type: `Boolean`
- Required: no
- Default: `false`
