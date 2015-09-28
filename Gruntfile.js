/**
 * css-sprites-generator
 *
 **/

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        clean: {
            build: {
                options: {
                    force: true // for removing build related stuff outside working dir
                },
                src: [
                    'tests/task/build'
                ]
            }
        },

        cssSprites: {
            files: ['tests/task/src/css/**/*.css'],
            options: {
                imagesSrc: './',
                imagesDest: './',
                stylesSrc: 'tests/task/src/css',
                stylesDest: 'tests/task/build/css'
            }
        }
    });


    // load this plugin's tasks.
    grunt.loadTasks('tasks');

    // grunt plugins
    grunt.loadNpmTasks('grunt-contrib-clean');


    // register test task
    grunt.registerTask('default', [
        'clean',
        'cssSprites'
    ]);

};
