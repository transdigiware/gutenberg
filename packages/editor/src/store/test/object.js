/**
 * Internal dependencies
 */
import { diff, merge } from '../object';

describe( 'object', () => {
	describe( 'diff', () => {
		it( 'should return RHS reference if result would be same as RHS', () => {
			const lhs = {};
			const rhs = { a: { b: { c: 1 } } };
			const result = diff( lhs, rhs );

			expect( result ).toBe( rhs );
		} );

		it( 'should omit deeply equal property values', () => {
			const lhs = { a: { b: { c: 1 } } };
			const rhs = { a: { b: { c: 1 } } };
			const result = diff( lhs, rhs );

			expect( result ).not.toBe( rhs );
			expect( result ).toEqual( {} );
		} );

		it( 'should return minimal object difference', () => {
			const lhs = { a: { b: { c: 1 } } };
			const rhs = { a: { b: { c: 1, d: 2 } } };
			const result = diff( lhs, rhs );

			expect( result ).not.toBe( rhs );
			expect( result ).toEqual( { a: { b: { d: 2 } } } );
		} );
	} );

	describe( 'merge', () => {
		it( 'should return equal reference if same, deeply', () => {
			const obj1 = { a: { b: { c: 1 } } };
			const obj2 = { a: { b: { c: 1 } } };
			const result = merge( obj1, obj2 );

			expect( result ).toBe( obj1 );
		} );

		it( 'should deeply merged object', () => {
			const obj1 = { a: { b: { c: 1 } } };
			const obj2 = { a: { b: { d: 2 } } };
			const result = merge( obj1, obj2 );

			expect( result ).not.toBe( obj1 );
			expect( result ).toEqual( { a: { b: { c: 1, d: 2 } } } );
		} );
	} );
} );
