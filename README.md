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
