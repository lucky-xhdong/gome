var callfile = require('child_process');
var n_path = require('path');
const fs = require('fs');
const chalk = require('chalk');
var request = require('request');

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


var config = readJson('./commit.json');
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
}else{
    var evt="";
}


var GSCM=config.GSCM;
var Jenkinsurl=config.Jenkinsurl; //jenkinsURL
var USER=config.userinfo; //用户名+密码
var loginurl=GSCM.loginurl+'callback='+GSCM.callback+'&username='+USER.username+'&password='+USER.password; //登陆
var calltagurl=GSCM.calltagurl+'callback='+GSCM.callback+'&branchesId='+GSCM.branchesId; // 打tag
var findtaginfo=GSCM.findtaginfo+'callback='+GSCM.callback+'&branchesId='+GSCM.branchesId; //查找最新版本号
var callcodeurl=GSCM.callcodeurl+'callback='+GSCM.callback+'&tagsId='; // 打包
var logurl=GSCM.logurl+'callback='+GSCM.callback+'&tagsId='; //打包log
var callbackname=GSCM.callback;
var cookiename; // cookie









function getLoginCookie(url,callbackname){
    return new Promise(function(resolve, reject) {
        var cookiename;
        request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var bodyjson=JSON.parse(body.replace(callbackname+'(',"").replace(')',""));
            if(bodyjson.flag=='Y'){
                cookiename=response.headers["set-cookie"];
                bodyjson.cookiename=cookiename;
                resolve(bodyjson);
            }
      }
        })
    })
 }

//获取打包平台登录的cookie
getLoginCookie(loginurl,callbackname).then(function(data){ 
        
        if(data.flag=='Y' && data.cookiename){
            console.log(chalk.yellow('登录成功！'));
            cookiename=data.cookiename;
            return tagsstart(calltagurl,callbackname,cookiename);
    }else{
        console.log(chalk.red('登录失败自己排查或者去GSCM手动发'))
    }
}).then(function(data){
    var     tagid="",//获取tagid
            findtags={}//获取tag信息
        
    if(data.flag=='Y'){
        console.log(chalk.yellow(data.message));
        return tagsstart(findtaginfo,callbackname,cookiename);
    }else{
            var reg = /编译状态不成功，不能创建新的Tags/;
            if(reg.test(data.message)){

                console.log(chalk.yellow('需要执行编译函数'));
                //console.log(callcodeurl)
                return tagsstart(findtaginfo,callbackname,cookiename);

            }else{
                console.log(chalk.red(data));// 可能是其他异常
            }
    }   

}).then(function(data){
    var tagid=data.tags[0].tag_id; //最新tagid
    var vision=data.tags[0].tag_name;//最新的版本号
    vision=vision.replace('_BL','')
    if(data.flag=='Y'){
        console.log(chalk.yellow('最新的tagid'+tagid));
        callcodeurl=callcodeurl+tagid;  //编译的tag url
        already(callcodeurl,callbackname,cookiename,tagid,logurl,Jenkinsurl,vision);
    }else{
        console.log(chalk.red('获取tagid失败:请到GSCM查看日志'));
    }
})




//调取Jenkins   json.dumps(payload)

function getJenkins(url,vision){
    console.log(vision);
var headerstr='name=WAR_LIST&value='+vision+'.tar.gz&statusCode=303&redirectTo=.&json=%7B%22parameter%22%3A+%7B%22name%22%3A+%22WAR_LIST%22%2C+%22value%22%3A+%22'+vision+'.tar.gz%22%7D%2C+%22statusCode%22%3A+%22303%22%2C+%22redirectTo%22%3A+%22.%22%7D&Submit=%E5%BC%80%E5%A7%8B%E6%9E%84%E5%BB%BA'
    var r=request.post(url,  {form:headerstr} ,function(error, response, body){
            console.log(chalk.yellow('发布成功'));
    })

}


function already(callcodeurl,callbackname,cookiename,id,logurl,Jenkinsurl,vision){ //正在编译
    tagsstart(callcodeurl,callbackname,cookiename).then(function(data){
            var callcodenum=0; //计数                 
            if(data.flag=='Y'){
                console.log(chalk.yellow('正在编译'));
                logurl=logurl+id;
                var timeer=setInterval(function(){
                    tagsstart(logurl,callbackname,cookiename,id).then(function(data){
                        callcodenum++;
                        if(data.flag=='Y'){
                            var reg = /SUCCESS/;
                            if(reg.test(data.log)){
                                console.log(chalk.yellow('打包成功'));
                                if(evt=='uat'){
                                    getJenkins(Jenkinsurl,vision);
                                }else{

                                    console.log(chalk.yellow('发生产请到GSCM点击发布基线'));
                                    console.log('版本号：'+vision)
                                }
                                
                                clearInterval(timeer);
                            }else{
                                if(callcodenum>10){
                                    clearInterval(timeer);
                                    console.log(chalk.red('打包失败:请到GSCM查看日志'));
                                    return false;
                                }
                                console.log(chalk.blue('正在打包...'));
                            }
                        }else{
                            console.log(chalk.red('打包失败:请到GSCM查看日志'));
                        }
                    })
                }, 2000);

            }else{
                console.log(chalk.red('编译失败:请到GSCM查看日志'));
            }
        })
}



function tagsstart(url,callbackname,cookie_val){  
    return new Promise(function(resolve, reject) {
        request({
                'url':url,
                'headers':{
                     'Cookie': cookie_val
                }
                    }, function (error, response, body) {
            //console.log(body)
            if (!error && response.statusCode == 200) {
                var bodyjson=body.replace(callbackname+'(',"").replace(/\)/g,"");
                resolve(JSON.parse(bodyjson));
            }else{
                console.log('接口出错了！！！')
            }
        })
    })
}
