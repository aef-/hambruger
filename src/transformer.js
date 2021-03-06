var _   = require( 'lodash' );

/**
 * More than meets the eye!
 * Takes a `block` and outputs a string using a converter (see `markdown.js`)
 * @param {object[]} blocks Array of comment/code objects generated by Doctrine and Esprima.
 * @param {object} options
 * @param {boolean} options.onlyPublic Only include explicit `@public` code.
 * @param {boolean} options.excludePrivate Exclude all `@private` code.
 * @param {boolean} options.includeCode Include code that's being documented. 
 * @constructor
 * @private
 */
function Transformer( blocks, options ) {
  this.blocks = blocks;
  this.options = options || { };
  this.convert = null; //see ./markdown for an example
}

Transformer.prototype.outputMarkdown = function( ) {
  this.convert = require( './markdown' );
  var output = this.run( );
  this.convert = null;
  return output;
};

Transformer.prototype.run = function( ) {
  return _.filter( _.map( this.blocks, this.runOne, this ), function( converted ) {
    return typeof converted === "string";
  } ).join( this.convert.newLine( ) + this.convert.newLine( ) );
};

/**
 * Generates output based on a converter for a single comment/code block.
 * @param {object} block
 * @param {object} block.comment Doctrine AST
 * @param {object} block.code Esprima AST
 */
Transformer.prototype.runOne = function( block ) {
  if( this.options.excludePrivate && this.isPrivate( block ) )
    return null;

  if( this.options.onlyPublic && !this.isPublic( block ) )
    return null;

  if( this.isMethod( block ) )
    return this.method( block );
  else if( this.isVariable( block ) ) {
    return this.variable( block );
  }
};

Transformer.prototype.method = function( block ) {
  var description = this.getDescription( block ),
      params = this.params( block ),
      ret = "";

  if( this.isConstructor( block ) )
    ret += this.convert.toH2( this.getSignature( block ) );
  else
    ret += this.convert.toH3( this.getSignature( block ) );

  if( description )
    ret += this.convert.newLine( ) + this.convert.newLine( ) + description;
  if( params )
    ret += this.convert.newLine( ) + this.convert.newLine( ) + params;

  return ret;
};

Transformer.prototype.params = function( block ) {
  var params = _.filter( block.comment.tags, { title: 'param' } ),
      item;

  return _.map( params, function( param ) {
    item = this.convert.toUnorderedItem( this.convert.toInlineCode( param.name ) );
    if( param.description )
      item += ' - ' + param.description;
    return item;
  }, this ).join( this.convert.newLine( ) );
};

Transformer.prototype.variable = function( block ) {
};

//TODO block should just be a class and these should be methods..
//TODO perhaps a way to make clearer between code/comment methods
//It's not very intitutive dealing with methods like params...
Transformer.prototype.isPublic = function( block ) {
  return !!_.find( block.comment.tags, { title: 'public' } );
};

Transformer.prototype.isPrivate = function( block ) {
  return !!_.find( block.comment.tags, { title: 'private' } );
};

Transformer.prototype.isConstructor = function( block ) {
  return !!_.find( block.comment.tags, { title: 'constructor' } );
};

Transformer.prototype.isMethod = function( block ) {
  if( !block.code )
    return false;

  return ( block.code.type === 'FunctionDeclaration' ||

          ( block.code.type === 'VariableDeclaration' &&
            !!_.find( block.code.declarations, function( dec ) { 
              return dec.init.type === 'FunctionExpression'; } ) ) ||

          ( block.code.type === 'ExpressionStatement' &&
            block.code.expression.right.type === 'FunctionExpression' ) )
};

Transformer.prototype.isVariable = function( block ) {
  return false;
};

Transformer.prototype.getDescription = function( block ) {
  return block.comment.description;
};

Transformer.prototype.getSignature = function( block ) {
  var name = this.getFunctionName( block ),
      params = this.getParamNames( block );

  return name + '(' + params.join(', ' ) + ')';
};

Transformer.prototype.getFunctionBlock = function( block ) {
  if( !block.code )
    return;

  var functionBlock = null;

  //function Method( )
  if( block.code.type === 'FunctionDeclaration' )
    functionBlock = block.code;

  //Object.prototype.method( )
  if( block.code.type === 'ExpressionStatement' &&
      block.code.expression.right.type === 'FunctionExpression' )
    functionBlock = block.code.expression.right;

  //var method = function( )
  if( block.code.type === 'VariableDeclaration' ) {
    functionBlock = _.find( block.code.declarations, function( dec ) { 
      return dec.init.type === 'FunctionExpression'; } );
    if( functionBlock )
      functionBlock = functionBlock.init;
  }

  return functionBlock;
};

Transformer.prototype.getParams = function( block ) {
  var functionBlock = this.getFunctionBlock( block );
  if( functionBlock )
    return functionBlock.params;
  return null;
};

Transformer.prototype.getFunctionName = function( block ) {
  if( !block.code )
    return;

  if( block.code.type === 'FunctionDeclaration' )
    return block.code.id.name;

  if( block.code.type === 'ExpressionStatement' &&
        block.code.expression.right.type === 'FunctionExpression' )
    return block.code.expression.left.property.name;

  if( block.code.type === 'VariableDeclaration' )
    return _.find( block.code.declarations, { type: 'VariableDeclarator' } ).id.name;
};

Transformer.prototype.getParamNames = function( block ) {
  return _.pluck( this.getParams( block ), 'name' );
};

module.exports = Transformer;
