/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const name = 'core/annotation';

export const annotation = {
	name,
	title: __( 'Annotation' ),
	match: {
		tagName: 'mark',
	},
	attributes: {
		className: 'class',
	},
	edit() {
		return null;
	},
};
