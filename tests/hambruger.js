var Hambruger = require( '../src/hambruger' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    async = require( 'async' ),
    _ = require( 'lodash' ),
    assert = require( 'assert' );

describe( 'Hambruger', function( ) {

  var fixtures = { };

  before( function( done ) {
    var files = [ './tests/code/page.js',
                  './tests/markdown/default.md',
                  './tests/markdown/private.md',
                  './tests/markdown/public.md'
                ];
    async.parallel(
     _.map( files, function( filename ) {
       return function( cb ) {
         fs.readFile( filename, function( err, content ) {
           if( err )
            return cb( err );
          fixtures[ path.basename( filename ) ] = content.toString( );
          cb( );
         } );
       };
     } ), done );
  } );

  beforeEach( function( ) {
  } );

  it( 'should convert to markdown', function( ) {
    var hambruger = new Hambruger( fixtures[ 'page.js' ] );
    assert.equal( hambruger.toMarkdown( ), fixtures[ 'default.md' ] );
  } );

  it( 'should only convert explicitly public objects', function( ) {
    var hambruger = new Hambruger( fixtures[ 'page.js' ], { onlyPublic: true } );
    assert.equal( hambruger.toMarkdown( ), fixtures[ 'public.md' ] );
  } );

  it( 'should ignore explicitly private objects', function( ) {
    var hambruger = new Hambruger( fixtures[ 'page.js' ], { excludePrivate: true } );
    assert.equal( hambruger.toMarkdown( ), fixtures[ 'private.md' ] );
  } );
} );
