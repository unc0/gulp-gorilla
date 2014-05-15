var through2 = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
var gorilla = require('gorillascript');
var tmp = require('tmp');
tmp.setGracefulCleanup();
var convert = require('convert-source-map');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');

var helper = require('./helper');

function compile(opt, file, src, callback) {
  var onFailure = function(err){
    if (err) {
      callback(new helper.ParseError(err, src, file));
    }
  };
  var onSuccess = function(data){
      callback(null, data.code);
  };
  gorilla.compile(src, {bare: opt.bare}).then(onSuccess, onFailure);
}

function compileWithSourceMap(opt, file, src, callback) {
  var onFailure = function(err){
    if (err) {
      callback(new helper.ParseError(err, src, file));
    }
  };
  // gorillascript cannot produce source map in stream way
  tmp.dir({mode: 0750, prefix: 'gorillaify-pain-in-the-ass_'}, function(err, tmpdir){
    var opts = {
      bare: opt.bare,
      sourceMap: path.join(tmpdir, 'pita.map'),
      output: path.join(tmpdir, 'pita.js'),
      input: file
    };
    var onSuccess = function(){
      fs.readFile(opts.output, 'utf8', function(err, data){
        if (err) { throw err; }
        var map = convert.fromMapFileSource(data, tmpdir);
        map.setProperty('sources', [file]);
        map.setProperty('file', file);
        map.setProperty('sourceRoot', "");
        map.setProperty('sourcesContent', [src]);

        // NOTE: trim sourcemap comment return-chars
        callback(null, convert.removeMapFileComments(data).slice(0, -2), map.toObject());
        fs.unlink(opts.sourceMap);
        fs.unlink(opts.output);
      });
    };
    gorilla.compileFile(opts).then(onSuccess,onFailure);
  });
}

module.exports = function (opt) {
  function transform(file, encoding, throughCb) {
    if (file.isNull() || helper.isNotGorilla(file.path)) {
      this.push(file);
      return throughCb();
    }
    if (file.isStream()) {
      return throughCb(new Error("gulp-gorilla: Streaming not supported"));
    }

    var _this = this;
    var src = file.contents.toString('utf8');
    var dest = gutil.replaceExtension(file.path, '.js');
    var options;

    if (typeof opt !== "undefined" && opt !== null) {
      options = {
        bare: opt.bare !== null ? !! opt.bare : false,
        input: file.path
      };
    }
    var compiledCallback = function(err, result, smap){
      if (err) {
        return throughCb(err);
      }
      file.contents = new Buffer(result);
      file.path = dest;
      if (typeof smap !== "undefined" && smap !== null) {
        applySourceMap(file, smap);
      }
      _this.push(file);
      return throughCb();
    };
    if (file.sourceMap || opt.sourceMap) {
      compileWithSourceMap(options, file.path, src, compiledCallback);
    } else {
      compile(options, file.path, src, compiledCallback);
    }
    return;
  }
  return through2.obj(transform);
};
