<template>
    <div class="demonstration">
        <g-header   v-model="initheader">
        </g-header>
        <div v-for="item in list" :key="item.name" class="pageinfos" >
            <p>页面:<span class="speed1">{{item.name}}</span> <a :href="item.url"  target='_blank'>进入</a></p>
            <p>进度:
                <span class="speedg" v-if="item.speed == '100%'">{{item.speed}}</span>
                <span class="speed" v-else-if="item.speed!='100%'">{{item.speed}}</span>
                </p>
            <p>联调时间:{{item.time}}</p>
            <p>联调遇到问题:{{item.problem}}</p>
        </div>
    </div>
</template>
<style>

 .demonstration{
     width: 100%;
     clear: both;
 }
.demonstration div.pageinfos{
    width: 300px;
    border:1px solid #ccc;
    float: left;
    display: block;
    margin: 10px 10px;
    padding: 10px 10px;
}
.demonstration div.pageinfos a{
     background-color: #409EFF; /* Green */
    border: none;
    color: #fff;
    padding: 2px 19px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin-left: 20px;
}
.demonstration div.pageinfos p{
    line-height: 25px;
}
.demonstration div.pageinfos .speed{
    color: red;
    margin-left:10px; 
}
.demonstration div.pageinfos .speedg{
    color: rgb(3, 245, 3);
    margin-left:10px; 
}
.demonstration div.pageinfos .speed1{
    color: rgb(0, 38, 255);
    margin-left:10px;  
}
</style>
<script>
import API from '@/api/demonstrationinfo.js';
export default {
  data(){
      return {
          list:[
        ],
        initheader:{ 
            "curstyle":{              //头数据
                "margin-bottom":"30px"
            },
            "showclose":"",
            "content":"联调进度"
        },
      }
  },
   mounted(){
       var that=this;
       API.demonstrationinfo().then(function(data){
           console.log(data)
           that.list=data.lists;
       })
   }
}
</script>


