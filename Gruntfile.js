'use strict';

module.exports = (grunt) => {

    grunt.initConfig({
            jshint: {
                files: [
                    'Gruntfile.js',
                    'server.js',
                    'config/**/*.js',
                    'controllers/**/*.js',
                    'helpers/**/*.js',
                    'lib/**/*.js'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            },

            express: {
                dev: {
                    options: {
                        script: 'server.js'
                    }
                }
            },

            mochaTest: {
                test: {
                    src: ['test/**/*.js'],
                    options: {
                        reporter: 'spec',
                        timeout: 5000
                    }
                }
            },
            
            watch: {
                express: {
                    files: ['<%= jshint.files %>'],
                    tasks: ['jshint', 'express'],
                    options: {
                        spawn: false
                    }
                }
            }

        });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('default', ['jshint', 'express', 'watch']);
    grunt.registerTask('generate-database', ['concat']);
};