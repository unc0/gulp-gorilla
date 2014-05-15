![status](https://secure.travis-ci.org/unc0/gulp-gorilla.png?branch=master)

## Information

<table>
<tr>
<td>Package</td><td>gulp-gorilla</td>
</tr>
<tr>
<td>Description</td>
<td>Compiles Gorillascript</td>
</tr>
</table>

## Usage

```gorillascript
let gorilla = require 'gulp-gorilla'
require! gulp
let gutil = require 'gulp-util'

gulp.task 'gorilla', #
  gulp.src './src/*.gs'
    .pipe gorilla({ +bare }).on('error', gutil.log)
    .pipe gulp.dest './public/'
```

### Error handling

gulp-gorilla will emit an error for cases such as invalid gorillascript syntax. If uncaught, the error will crash gulp.

You will need to attach a listener (i.e. `.on('error')`) for the error event emitted by gulp-gorilla:

```gorillascript
let gorilla-stream = gorilla { +bare }

// Attach listener
gorilla-stream.on 'error', #(err)
  throw? err
```

In addition, you may utilize [gulp-util](https://github.com/wearefractal/gulp-util)'s logging function:

```gorillascript
let gutil = require 'gulp-util'

// ...

let gorilla-stream = gorilla { +bare }

// Attach listener
gorilla-stream.on 'error', gutil.log

```

Since `.on(...)` returns `this`, you can make you can compact it as inline code:

```gorillascript

gulp.src './src/*.gs'
  .pipe gorilla({ +bare }).on('error', gutil.log)
  // ...
```

## Options

```gorillascript
// default options
let opt =
  bare: false
  source-map: false
```

## Source maps

gulp-gorilla can be used in tandem with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) to generate source maps for the gorilla to javascript transition. You will need to initialize [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) prior to running the gulp-gorilla compiler and write the source maps after.

```gorillascript
let sourcemaps = require('gulp-sourcemaps');

gulp.src './src/*.gs'
  .pipe sourcemaps.init()
  .pipe gorilla({ +bare }).on('error', gutil.log)
  .pipe sourcemaps.write()
  .pipe './dest/js'

// will write the source maps inline in the compiled javascript files
```

By default, [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) writes the source maps inline in the compiled javascript files. To write them to a separate file, specify a relative file path in the `sourcemaps.write()` function.

```javascript
let sourcemaps = require('gulp-sourcemaps');

gulp.src './src/*.gs'
  .pipe sourcemaps.init()
  .pipe gorilla({ +bare }).on('error', gutil.log)
  .pipe sourcemaps.write './maps'
  .pipe './dest/js'

// will write the source maps to ./dest/js/maps
```

## LICENSE

(MIT License)
