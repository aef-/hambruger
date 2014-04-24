hambruger
=====

Converts JSDOC3 into Markdown to be thrown up on your Github README/Wiki or [Flatdoc](http://ricostacruz.com/flatdoc/).

## Notice

As of now this project is experimental. The only goal is to provide an easily generated documented API to be shown in your README.md from JSDOC. This means it's not as smart as it could be and expects certain things such as your block comments to be followed by the object it's documenting and does not differ between a class property and a file encompassed property. Please raise an issue and let me know the direction this thing should take. Thanks.

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

## Examples

Will provide more extensive ones as more projects use this and the behaviour is fleshed out. For now, here you go: [examples](https://github.com/aef-/hambruger/blob/develop/tests/markdown/).
