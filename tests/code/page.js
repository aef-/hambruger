/* This code is being used in [ToeCutter](https://github.com/aef-/toecutter) */

var _       = require( 'lodash' ),
    helper  = require( './helper' ),
    Q       = require( 'q' ),
    request = require( 'request' );


/**
 * @param {object} opts
 * @param {string} opts.url
 * @param {object} opts.requestOpts See [node-request](https://github.com/mikeal/request).
 * @constructor
 * @private
 */
var Page = function( opts ) {
  this.options = {
    requestOpts: { }
  };

  _.assign( this.options, opts );

  this._body = null;
  this._attempts = 0;
  this._stepsFromRoot = 0;
  this._isRunning = false;
  this._isFetched = false;
  this._startTime = null;
  this._endTime = null;

  this._request = null;

  this._url = helper.normalizeUrl( this.options.url );
};

/**
 * @returns {promise}
 * @private
 */
Page.prototype.fetch = function( ) {
  var self = this, req, dfd = Q.defer( );

  this._attempts += 1;
  this._isRunning = true;
  this._startTime = Date.now( );

  this._request = request( this._url.href, this.options.requestOpts, function( err, resp, body ) {
    self._endTime = Date.now( );
    if( err )
      dfd.reject( new Error( err ), self );
    else {
      if( resp.statusCode == 200 || resp.statusCode == 201 ) {
        self._body = body;
        dfd.resolve( self );
      }
      else
        dfd.reject( new Error( resp.statusCode ), self );
      self._isFetched = true
    }
    self._isRunning = false;
  } );

  return dfd.promise;
};

/**
 * @returns {request}
 * @public
 */
Page.prototype.getRequest = function( ) {
  return this._request;
};

/**
 * @returns {string}
 * @public
 */
Page.prototype.getBody = function( ) {
  return this._body;
};

/**
 * @returns {boolean}
 * @public
 */
Page.prototype.isFetched = function( ) {
  return this._isFetched;
};

/**
 * @returns {boolean}
 * @public
 */
Page.prototype.isRunning = function( ) {
  return this._isRunning;
};

/**
 * @returns {number} Time it took to finish the request in milliseconds.
 * @public
 */
Page.prototype.getTimeToFinish = function( ) {
  if( this._startTime && this._endTime )
    return this._endTime - this._startTime;
  return -1;
};

/**
 * @returns {urlObj}
 * @public
 */
Page.prototype.getUrl = function( ) {
  return this._url;
};

/**
 * @returns {number} Number of fetches that's been called.
 * @public
 */
Page.prototype.getAttempts = function( ) {
  return this._attempts;
};

module.exports = Page;
