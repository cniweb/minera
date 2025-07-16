'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
			clientViews: ['application/views/**/*.html'],
			clientJS: ['assets/js/minera.js'],
			clientCSS: ['assets/css/*.css'],
		},
		applicationFiles = require('./assets/media.json');

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
		},
		jshint: {
			all: {
				options: {
					jshintrc: true
				},
				files: {
					src: [watchFiles.clientJS],
				}
			}
		},
		ngmin: {
			production: {
				files: {
					'assets/js/application.js': [ applicationFiles.js ]
				}
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'assets/js/application.min.js': 'assets/js/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'assets/css/application.min.css': [ applicationFiles.css ]
				}
			}
		},
		exec: {
			test: {
				cmd: 'npm test'
			}
		},
		concurrent: {
			default: ['watch'],
			debug: ['watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		copy: {
			dist: {
				files: [
					{
					//for glyphicon fonts
						expand: true,
						cwd: 'assets/vendor/bootstrap/fonts',
						src: ['*.*'],
						dest: 'assets/fonts/'
					},
					// Moved to CDN in header file
					{
					//for font-awesome font
						expand: true,
						cwd: 'assets/vendor/font-awesome/fonts',
						src: ['*.*'],
						dest: 'assets/fonts/'
					},
					{
					//for ionicons font
						expand: true,
						cwd: 'assets/vendor/ionicons/fonts',
						src: ['*.*'],
						dest: 'assets/fonts/'
					}
				]
			},
		},
		clean: {
			options: { force: true },
			stuff: ['assets/fonts/*']
		},
		bump: {
    		options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'],
				createTag: false,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'origin',
				gitDescribeOptions: '--always --abbrev=1',
				globalReplace: false,
				prereleaseName: 'rc',
				regExp: false
    		}
    	}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);
	
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// Usage/Help
	grunt.registerTask('help', 'Usage', function() {
		console.log('Build: grunt build');
	});

	// Bower and Npm install
	grunt.registerTask('install', 'install the backend and frontend dependencies', function() {
		var exec = require('child_process').exec;
		var cb = this.async();
		exec('bower install', {cwd: '.'}, function(err, stdout, stderr) {
			cb();
		});
	});

	// Default task(s).
	grunt.registerTask('default', ['install', 'lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Lint task(s).
	//grunt.registerTask('lint', ['jshint', 'csslint']);
	grunt.registerTask('lint', ['jshint']);

	// Test task(s).
	grunt.registerTask('test', ['lint', 'exec:test']);

	grunt.registerTask('copy:production', ['copy']);

	// Build task(s).
	grunt.registerTask('build:production', ['lint', 'ngmin:production', 'uglify:production', 'cssmin', 'clean', 'copy']);
};
