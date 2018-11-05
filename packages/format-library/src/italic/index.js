/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { toggleFormat } from '@wordpress/rich-text';

const name = 'core/italic';

export const italic = {
	name,
	title: __( 'Italic' ),
	tagName: 'img',
	canHandleBareElement: true,
	edit( { isActive, value, onChange, ToolbarButton, Shortcut } ) {
		const onToggle = () => onChange( toggleFormat( value, { type: name } ) );

		return (
			<Fragment>
				<Shortcut
					type="primary"
					character="i"
					onUse={ onToggle }
				/>
				<ToolbarButton
					name="italic"
					icon="editor-italic"
					title={ __( 'Italic' ) }
					onClick={ onToggle }
					isActive={ isActive }
					shortcutType="primary"
					shortcutCharacter="i"
				/>
			</Fragment>
		);
	},
};
