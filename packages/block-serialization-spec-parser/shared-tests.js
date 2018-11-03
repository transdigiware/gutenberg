export const jsTester = ( parse ) => () => {
	describe( 'output structure', () => {
		test( 'output is an array', () => {
			expect( parse( '' ) ).toEqual( expect.any( Array ) );
			expect( parse( 'test' ) ).toEqual( expect.any( Array ) );
			expect( parse( '<!-- wp:void /-->' ) ).toEqual( expect.any( Array ) );
			expect( parse( '<!-- wp:block --><!-- wp:inner /--><!-- /wp:block -->' ) ).toEqual( expect.any( Array ) );
			expect( parse( '<!-- wp:first /--><!-- wp:second /-->' ) ).toEqual( expect.any( Array ) );
		} );

		test( 'blockName is namespaced string (except freeform)', () => {
			expect( parse( 'freeform has null name' )[ 0 ] ).toHaveProperty( 'blockName', null );
			expect( parse( '<!-- wp:more /-->' )[ 0 ] ).toHaveProperty( 'blockName', 'core/more' );
			expect( parse( '<!-- wp:core/more /-->' )[ 0 ] ).toHaveProperty( 'blockName', 'core/more' );
			expect( parse( '<!-- wp:my/more /-->' )[ 0 ] ).toHaveProperty( 'blockName', 'my/more' );
		} );

		test( 'JSON attributes are key/value object', () => {
			expect( parse( 'freeform has empty attrs' )[ 0 ] ).toHaveProperty( 'attrs', {} );
			expect( parse( '<!-- wp:void /-->' )[ 0 ] ).toHaveProperty( 'attrs', {} );
			expect( parse( '<!-- wp:void {"key": "value"} /-->' )[ 0 ] ).toHaveProperty( 'attrs', { key: 'value' } );
		} );

		test( 'innerBlocks is a list', () => {
			expect( parse( 'freeform has empty innerBlocks' )[ 0 ] ).toHaveProperty( 'innerBlocks', [] );
			expect( parse( '<!-- wp:void /-->' )[ 0 ] ).toHaveProperty( 'innerBlocks', [] );
			expect( parse( '<!-- wp:block --><!-- /wp:block -->' )[ 0 ] ).toHaveProperty( 'innerBlocks', [] );

			const withInner = parse( '<!-- wp:block --><!-- wp:inner /--><!-- /wp:block -->' )[ 0 ];
			expect( withInner ).toHaveProperty( 'innerBlocks', expect.any( Array ) );
			expect( withInner.innerBlocks ).toHaveLength( 1 );

			const withTwoInner = parse( '<!-- wp:block -->a<!-- wp:first /-->b<!-- wp:second /-->c<!-- /wp:block -->' )[ 0 ];
			expect( withTwoInner ).toHaveProperty( 'innerBlocks', expect.any( Array ) );
			expect( withTwoInner.innerBlocks ).toHaveLength( 2 );
		} );

		test( 'innerHTML is a string', () => {
			expect( parse( 'test' )[ 0 ] ).toHaveProperty( 'innerHTML', expect.any( String ) );
			expect( parse( '<!-- wp:test /-->' )[ 0 ] ).toHaveProperty( 'innerHTML', expect.any( String ) );
			expect( parse( '<!-- wp:test --><!-- /wp:test -->' )[ 0 ] ).toHaveProperty( 'innerHTML', expect.any( String ) );
			expect( parse( '<!-- wp:test -->test<!-- /wp:test -->' )[ 0 ] ).toHaveProperty( 'innerHTML', expect.any( String ) );
		} );
	} );

	describe( 'generic tests', () => {
		test( 'parse() accepts inputs with multiple Reusable blocks', () => {
			expect( parse( '<!-- wp:block {"ref":313} /--><!-- wp:block {"ref":482} /-->' ) ).toEqual( [
				expect.objectContaining( {
					blockName: 'core/block',
					attrs: { ref: 313 },
				} ),
				expect.objectContaining( {
					blockName: 'core/block',
					attrs: { ref: 482 },
				} ),
			] );
		} );

		test( 'treats void blocks and empty blocks identically', () => {
			expect( parse(
				'<!-- wp:block /-->'
			) ).toEqual( parse(
				'<!-- wp:block --><!-- /wp:block -->'
			) );

			expect( parse(
				'<!-- wp:my/bus { "is": "fast" } /-->'
			) ).toEqual( parse(
				'<!-- wp:my/bus { "is": "fast" } --><!-- /wp:my/bus -->'
			) );
		} );

		test( 'should grab HTML soup before block openers', () => {
			[
				'<p>Break me</p><!-- wp:block /-->',
				'<p>Break me</p><!-- wp:block --><!-- /wp:block -->',
			].forEach( ( input ) => expect( parse( input ) ).toEqual( [
				expect.objectContaining( { innerHTML: '<p>Break me</p>' } ),
				expect.objectContaining( { blockName: 'core/block', innerHTML: '' } ),
			] ) );
		} );

		test( 'should grab HTML soup before inner block openers', () => [
			'<!-- wp:outer --><p>Break me</p><!-- wp:block /--><!-- /wp:outer -->',
			'<!-- wp:outer --><p>Break me</p><!-- wp:block --><!-- /wp:block --><!-- /wp:outer -->',
		].forEach( ( input ) => expect( parse( input ) ).toEqual( [
			expect.objectContaining( {
				innerBlocks: [ expect.objectContaining( { blockName: 'core/block', innerHTML: '' } ) ],
				innerHTML: '<p>Break me</p>',
			} ),
		] ) ) );

		test( 'should grab HTML soup after blocks', () => [
			'<!-- wp:block /--><p>Break me</p>',
			'<!-- wp:block --><!-- /wp:block --><p>Break me</p>',
		].forEach( ( input ) => expect( parse( input ) ).toEqual( [
			expect.objectContaining( { blockName: 'core/block', innerHTML: '' } ),
			expect.objectContaining( { innerHTML: '<p>Break me</p>' } ),
		] ) ) );
	} );
};

const hasPHP = 'test' === process.env.NODE_ENV ? ( () => {
	const process = require( 'child_process' ).spawnSync( 'php', [ '-r', 'echo 1;' ], { encoding: 'utf8' } );

	return process.status === 0 && process.stdout === '1';
} )() : false;

// skipping if `php` isn't available to us, such as in local dev without it
// skipping preserves snapshots while commenting out or simply
// not injecting the tests prompts `jest` to remove "obsolete snapshots"
// eslint-disable-next-line jest/no-disabled-tests
const makeTest = hasPHP ? ( ...args ) => describe( ...args ) : ( ...args ) => describe.skip( ...args );

export const phpTester = ( name, filename ) => makeTest(
	name,
	'test' === process.env.NODE_ENV ? jsTester( ( doc ) => {
		const process = require( 'child_process' ).spawnSync(
			'php',
			[ '-f', filename ],
			{
				input: doc,
				encoding: 'utf8',
				timeout: 30 * 1000, // abort after 30 seconds, that's too long anyway
			}
		);

		if ( process.status !== 0 ) {
			throw new Error( process.stderr || process.stdout );
		}

		try {
			return JSON.parse( process.stdout );
		} catch ( e ) {
			throw new Error( 'failed to parse JSON:\n' + process.stdout );
		}
	} ) : () => {}
);
