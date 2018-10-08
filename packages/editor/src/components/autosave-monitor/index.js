/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

export class AutosaveMonitor extends Component {
	componentDidUpdate( prevProps ) {
		const { isAutosaveable } = this.props;

		if (
			prevProps.isAutosaveable !== isAutosaveable
		) {
			this.toggleTimer( isAutosaveable );
		}
	}

	componentWillUnmount() {
		this.toggleTimer( false );
	}

	toggleTimer( isPendingSave ) {
		clearTimeout( this.pendingSave );
		const { autosaveInterval } = this.props;
		if ( isPendingSave ) {
			this.pendingSave = setTimeout(
				() => this.props.autosave(),
				autosaveInterval * 1000
			);
		}
	}

	render() {
		return null;
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			isEditedPostAutosaveable,
			getEditorSettings,
		} = select( 'core/editor' );
		const { autosaveInterval } = getEditorSettings();
		return {
			isAutosaveable: isEditedPostAutosaveable(),
			autosaveInterval,
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		autosave: dispatch( 'core/editor' ).autosave,
	} ) ),
] )( AutosaveMonitor );
