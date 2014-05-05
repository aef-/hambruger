![brugerking](https://raw.githubusercontent.com/aef-/hambruger/develop/media/brugerking.png)

hambruger
=====

Converts JSDOC3 into Markdown to be thrown up on your Github README/Wiki or [Flatdoc](http://ricostacruz.com/flatdoc/).

## Usage
```
$ npm install -g hambruger 
$ cat src/hambruger.js | hambruger >> API.md
```

Include only explicitly `@public` methods.

```
$ cat src/hambruger.js | hambruger --only-public >> API.md
```

Exclude explicitly `@private` methods.

```
$ cat src/hambruger.js | hambruger --exclude-private >> API.md
```

## Supported Tags

```js
/**
 * Description of object. Requires object to directly follow comment block.
 * @constructor
 * @param {object} options Description of options
 * @param {string} options.prop Description of property
 * @private
 * @public
 */
function Example( options ) {
}
```


## Examples

Will provide more extensive ones as more projects use this and the behaviour is fleshed out. For now, here you go: [examples](https://github.com/aef-/hambruger/blob/develop/tests/markdown/).
