var callfile = require('child_process');
var n_path = require('path');
const fs = require('fs');
const chalk = require('chalk');

function readJson(path) {    //读取当前json文件
    var readFile = function(path) {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    };
    var path = n_path.join(process.cwd(), path);


    if(fs.existsSync){
    	return  readFile(path);
    }else{
    	console.log(chalk.red(path+"文件找不到"));
    	process.exit(-1);
    }
};
var config = readJson('./commit/commit.json');
var argv;
var evt;
try {
argv = JSON.parse(process.env.npm_config_argv).original;
}	catch(ex) {
argv = process.argv;
}

var arguments = argv.splice(2);

if(arguments.length>0){
	var evt=arguments[0].substring(1);
  if(evt!='uat'){
    console.log(chalk.yellow('please input：')+chalk.red('npm run commit -uat'))
    return false;
  }
}else{
	var evt="";
}
var dirnameurl=__dirname;
var rooturl=dirnameurl.replace(/\\/g,'/').replace('/commit',"");
var svnurl=config.commitUrl.distSvn;

function  commitarr(option,callback){
  var child_proc=callfile.exec(option,null,function (error, stdout, stderr) {
      //callback(err, stdout, stderr);
       if (error !== null) {
            console.log(chalk.red('exec error: ' + error));
          }
          else {
           callback?callback(stdout):""
          };
  });
  child_proc.stdout.on('data', function(data) {
    console.log(chalk.yellow(data));
  })
}

commitarr(rooturl+'/commit/cnpminstall.bat '+rooturl,function(stdout){ //第一次调cnpm install
    commitarr(rooturl+'/commit/build.bat '+rooturl+' '+svnurl+' '+evt,function(){ //第二次调build
          commitarr(rooturl+'/commit/update.bat '+rooturl,function(stdout){ // 第三次 update  如果两个人同时打  会停止
              var str=/static/g
                if(str.test(stdout)){
                  commitarr(rooturl+'/commit/resolve.bat '+rooturl,function(){
                    console.log(chalk.yellow('again build：')+chalk.red('npm run commit -uat'))
                  })
                  return false;
                }
              commitarr(rooturl+'/commit/commit.bat '+rooturl,function(){ // 第四次 commit
                  commitarr(rooturl+'/commit/Release.bat '+rooturl+' -'+evt,function(){ // 第五次 调打包和发布接口
                    return  false
                  })
              })
          
          })
        
    })

})
