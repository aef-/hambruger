var _ = require( 'lodash' ),
    doctrine = require( 'doctrine' ),
    esprima  = require( 'esprima' ),
    Transformer = require( './transformer' );

/**
 * @param {string} raw Code to be parsed for JSDOC comments.
 * @param {object} options
 * @param {boolean} options.onlyPublic Only include explicit `@public` code.
 * @param {boolean} options.excludePrivate Exclude all `@private` code.
 * @param {boolean} options.includeCode Include code that's being documented.
 * @constructor
 * @public
 */
function Hambruger( raw, options ) {
  this.options = options || { };
  this._raw = raw;
  this._ast = esprima.parse( raw, { raw: true, loc: true, tolerant: true, comment: true } );

  //An array of objects
  //obj.comment {{doctrine}}
  //obj.code {{esprima}}
  this._data = [ ];

  this.init( );
  this.Transformer = new Transformer( this._data, this.options );
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
  return this.Transformer.outputMarkdown( );
};

module.exports = Hambruger;
