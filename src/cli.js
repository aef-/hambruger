var concat = require( 'concat-stream' ),
    Hambruger = require( './hambruger' ),
    args = process.argv.slice( 2 );

var unwrap = getFlagValue( '--unwrap', { isSwitch: true } ) || getFlagValue( '--u', { isSwitch: true } );
    recoverable = getFlagValue( '--recoverable', { isSwitch: true } ) || getFlagValue( '--r', { isSwitch: true } ),
    sloppy = getFlagValue( '--sloppy', { isSwitch: true } ) || getFlagValue( '--s', { isSwitch: true } ),
    lineNumbers = getFlagValue( '--line-numbers', { isSwitch: true } ) || getFlagValue( '--l', { isSwitch: true } ),
    tags = getFlagValue( '--tags', { isArray: true } ) || getFlagValue( '--t', { isArray: true } );


var write = concat( function( data ) {
  var s = new Hambruger( data.toString( ), {
    unwrap: unwrap,
    recoverable: recoverable,
    sloppy: sloppy,
    lineNumbers: lineNumbers,
    tags: tags
  }, { unwrap: true } );
  s.toMarkdown( );
} );

process.stdin.setEncoding( 'utf8' );
process.stdin.pipe( write );


/**
 * Gets flag values from command line arguments.
 * @param arg {string} Name of the flag
 * @param opts {object}
 * @params opts.isSwitch {boolean} Does the flag return true if its present?
 * @params opts.isArray {boolean} Does the flag expect a comma delimited list?
 * @return {string|boolean|array}
 */
function getFlagValue( flag, opts ) {
  var index = args.indexOf( flag );

  if( opts.isSwitch )
    return ~index ? true : false;

  if( ~index )
    if( opts.isArray )
      return args[ index + 1 ].split( ',' );
    else
      return args[ index + 1 ]

  return null;
}
