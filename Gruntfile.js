module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['client/**', 'test/**'],
      tasks: ['browserify']
    },
    browserify: {
      vendor: {
        src: [],
        dest: 'public/js/vendor.js',
       
      },
      client: {
        src: ['client/**/*.js'],
        dest: 'public/js/scripts.js',
       
      }
    },

    concat: {
      'public/js/main.js': ['public/js/vendor.js', 'public/js/app.js']
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base:'public',
          keepalive:true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('build:prod', ['browserify', 'concat']);
  
};