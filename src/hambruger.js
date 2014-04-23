var _ = require( 'lodash' ),
    doctrine = require( 'doctrine' ),
    esprima  = require( 'esprima' ),
    Transformer = require( './transformer' );

/**
 * @param {string} raw Data to be parsed for JSDOC comments.
 * @param {object} options See doctrine documentation.
 * @constructor
 * @public
 */
function Hambruger( raw, options ) {
  this._raw = raw;
  this._ast = esprima.parse( raw, { raw: true, loc: true, tolerant: true, comment: true } );

  //An array of objects
  //obj.comment {{doctrine}}
  //obj.code {{esprima}}
  this._data= [ ];

  this.init( );
}

/**
 * @private
 */
Hambruger.prototype.init = function( ) {
  _.each( this._ast.comments, function( comment, i ) {
    if( comment.type === 'Block' )
      this._data.push( {
        comment: doctrine.parse( comment.value, { unwrap: true } ),
        //find code relating to comment (assume it's the next line)
        code: _.find( this._ast.body, function( n ) {
          return comment.loc.end.line === n.loc.start.line - 1;
        }, this )
      } );
  }, this );
};

/**
 * @returns {string} String containing markdown formatted documentation.
 * @public
 */
Hambruger.prototype.toMarkdown = function( ) {
  var t = new Transformer( this._data );
  return t.run( );
};

module.exports = Hambruger;
