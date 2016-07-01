module.exports=function(grunt){
	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				potions:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}

	})
	//文件增删改就会重新执行任务
	grunt.loadNpmTasks('grunt-contrib-watch')
	//实时监听  app.js改动就会重启
	grunt.loadNpmTasks('grunt-nodemon')
	//慢任务开发   跑阻塞的任务
	grunt.loadNpmTasks('grunt-concurrent')

	grunt.option('force',true)
	grunt.registerTask('default',['concurrent'])
}