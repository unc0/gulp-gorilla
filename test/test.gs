let gorilla = require '../'
let gutil = require 'gulp-util'
require! gorillascript
require! prova
require! fs
require! path
require! through2

let create-file(file-path, contents)
  let base = path.dirname file-path
  new gutil.File {
    path: file-path
    base
    cwd: path.dirname base
    contents
  }

prova 'gulp-gorilla', #(t)

  t.test 'should emit errors correctly', #(t)
    let file-path = '/tmp/tmp_tmp_file.gs'
    let contents = new Buffer 'if true'
    gorilla({ +bare })
      .on 'error', #(err)
        t.equal err.file-name, file-path
        t.end()
      .on 'data', #(new-file)
        t.fail 'no file should have been emitted!'
      .write create-file(file-path, contents)

  t.test 'should compile without sourcemap', #(t)
    let create-gorilla-stream(t, opts, expected)
      gorilla(opts)
        .on 'error', #(err)-> t.fail(err.messages)
        .on 'data', #(new-file)
          t.equal new-file.contents.to-string('utf-8'), expected
          t.end()

    t.test 'should compile without bare', #(t)
      let file-path = path.join __dirname, 'fixtures/example1.gs'
      let contents = new Buffer(fs.read-file-sync file-path)
      let expected = gorillascript.compile-sync(String(contents)).code
      create-gorilla-stream(t, {}, expected).write create-file(file-path, contents)

    t.test 'should compile with bare', #(t)
      let opts = { +bare }
      let file-path = path.join __dirname, 'fixtures/example1.gs'
      let contents = new Buffer(fs.read-file-sync file-path)
      let expected = gorillascript.compile-sync(String(contents), opts).code
      create-gorilla-stream(t, opts, expected).write create-file(file-path, contents)

  t.test 'should compile with sourcemap', #(t)
    let load-source-map(file-path, contents)
      let map = JSON.parse fs.read-file-sync file-path
      map.mappings
    let create-gorilla-stream(t, opts, expected)
      opts.source-map := true
      gorilla(opts)
        .on 'error', #(err)-> t.fail(err.messages)
        .on 'data', #(new-file)
          t.equal new-file.contents.to-string('utf-8'), expected.code
          t.equal new-file.source-map.mappings, expected.source-map
          t.end()

    t.test 'should compile without bare', #(t)
      let file-path = path.join __dirname, 'fixtures/example1.gs'
      let contents = new Buffer(fs.read-file-sync file-path)
      let expected =
        code: gorillascript.compile-sync(String(contents)).code
        source-map: load-source-map gutil.replace-extension file-path, '.map'
      create-gorilla-stream(t, {}, expected).write create-file(file-path, contents)

    t.test 'should compile with bare', #(t)
      let opts = { +bare }
      let file-path = path.join __dirname, 'fixtures/example1.gs'
      let contents = new Buffer(fs.read-file-sync file-path)
      let expected =
        code: gorillascript.compile-sync(String(contents), opts).code
        source-map: load-source-map gutil.replace-extension file-path, '.baremap'
      create-gorilla-stream(t, opts, expected).write create-file(file-path, contents)
