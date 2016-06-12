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
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    browserify: {
      vendor: {
        src: [],
        dest: 'public/vendor.js',
        options: {
          require: ['jquery'],
          alias: {
            momentWrapper: './lib/moments.js'
          }
        }
      },
      client: {
        src: ['client/**/*.js'],
        dest: 'public/app.js',
        options: {
          external: ['jquery', 'momentWrapper'],
        }
      }
    },

    concat: {
      'public/main.js': ['public/vendor.js', 'public/app.js']
    }
  });

  grunt.loadTasks('../../tasks');
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  


  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['browserify', 'concat']);
  

};