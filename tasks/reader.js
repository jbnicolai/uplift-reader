/*
 * uplift-reader
 * https://github.com/mariusc23/uplift-reader
 *
 * Copyright (c) 2014 Marius Craciunoiu
 * Licensed under the MIT license.
 */

'use strict';

var reader = require('../lib/reader');
var _      = require('lodash');
var chalk  = require('chalk');
var util   = require('util');

module.exports = function (grunt) {
  grunt.registerMultiTask('uplift', 'Prepare grunt configs for concatenation.', function () {
    var that = this;

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: grunt.util.linefeed
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      // Iterate over each file
      _.forEach(file.src, function(fileSrc) {

        var fileContent = grunt.file.read(fileSrc);

        var build = reader.read(fileContent);

        var uglifyConfig = {
          uglify: {
            uplift: {
              files: build.$uglify
            }
          }
        };

        var cssminConfig = {
          cssmin: {
            uplift: {
              files: build.$cssmin
            }
          }
        };

        grunt.config.merge(uglifyConfig);
        grunt.config.merge(cssminConfig);

        grunt.verbose.writeln(chalk.cyan(chalk.underline('uglify:uplift')));
        grunt.verbose.writeln(util.inspect(uglifyConfig), {
          showHidden: false,
          depth: null
        });

        grunt.verbose.writeln(chalk.cyan(chalk.underline('cssmin:uplift')));
        grunt.verbose.writeln(util.inspect(cssminConfig), {
          showHidden: false,
          depth: null
        });

        if (file.dest) {
          try {
            grunt.file.write(file.dest, reader.replaceBuildAreas(fileContent));
          } catch(ex) {
            grunt.file.write(file.dest + fileSrc.replace(/^.*[\\\/]/, ''), reader.replaceBuildAreas(fileContent));
          }
        }

      });

    });

  });

};