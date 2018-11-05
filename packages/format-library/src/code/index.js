/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { toggleFormat } from '@wordpress/rich-text';

const name = 'core/code';

export const code = {
	name,
	title: __( 'Code' ),
	tagName: 'code',
	canHandleBareElement: true,
	edit( { value, onChange, Shortcut } ) {
		const onToggle = () => onChange( toggleFormat( value, { type: name } ) );

		return (
			<Fragment>
				<Shortcut
					type="access"
					character="x"
					onUse={ onToggle }
				/>
			</Fragment>
		);
	},
};
