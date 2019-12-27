<template>
  <div class="container">
 <!--  <g-header  @clickClose="jumpto" v-model="initheader">
        </g-header> -->
    <el-button v-if="LOGINDATA.orderplatform_creatfiles_bao" type="primary" size="small" @click.stop="submitForm('rulesmesinfo')">保存</el-button>
<!--     <g-header @clickClose="jumpto" v-model="initheader">
</g-header> -->
<el-steps class="tit" :active="active" finish-status="success" align-center>
  <el-step title="输入员工应用系统帐号"></el-step>
  <el-step title="确认员工信息"></el-step>
  <el-step title="解绑完成"></el-step>
</el-steps>
<div class="cont" v-if="active === 0">
      <!--   <el-input v-model="userId" placeholder="请输入员工应用系统号" class="user"></el-input>
      <el-button class="button-box" @click="initNext">下一步</el-button> -->
      <el-form ref="userIdform"  :model="userIdform" :rules="formrules"  >
        <el-form-item prop="userId"  >
          <el-input v-model="userIdform.userId" placeholder="请输入员工应用系统帐号" maxlength="20" auto-complete="off"   class="user" 
         clearable></el-input>
        </el-form-item>

      </el-form>
      <el-button class="button-box"  v-on:click="initNext">下一步</el-button>
    </div>
    <div class="cont" v-else-if="active === 1">
      <div class="table-box">
        <el-row>
          <el-col :span="5">
            <div class="table-tit">员工姓名</div>
          </el-col>
          <el-col :span="19">
            <div class="table-cont">{{info.name}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="table-tit">员工编号</div>
          </el-col>
          <el-col :span="19">
            <div class="table-cont">{{info.id}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="table-tit">岗位名称</div>
          </el-col>
          <el-col :span="19">
            <div class="table-cont">{{info.post}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="table-tit">手机号码</div>
          </el-col>
          <el-col :span="19">
            <div class="table-cont">{{info.tel}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="table-desc">是否确定将该员工账号与现有设备解绑？</div>
      <el-button class="button-box step2" @click="nextConfirmBtn">确认</el-button>
      <el-button class="button-box step2 first" @click="returnFirst">返回上一步</el-button>
    </div>
    <div class="cont" v-else>
      <div class="desc">账号
        <font>{{info.gomeId}}</font>与设备解绑成功</div>
        <div class="desc">下次登录成功将完成绑定</div>
        <el-button class="button-box" @click="next">确定</el-button>
      </div>
    </div>
  </template>
  <style>
    {
      font-family: "Mircosoft YaHei";
    }

    .container {
      width: 80%;
      margin: 0 auto;
    }

    .tit {
      margin-top: 60px;
    }


    .el-step__icon {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }

    .el-step.is-horizontal .el-step__line {
      top: 24px;
    }

    .el-step__icon-inner {
      font-size: 24px;
      font-weight: 500;
    }

    .el-step__head.is-finish .el-step__icon-inner {
      color: #fff;
    }

    .is-finish .el-step__line {
      background: #409EFF;
    }

    .el-step__head.is-finish .el-step__icon {
      background: #409EFF;
    }

    .el-step__head.is-process {
      color: #409EFF;
      border-color: #409EFF;
      font-weight: 500;
    }

    .el-step__title.is-process {
      color: #409EFF;
    }

    .cont {
      width: 400px;
      margin: 40px auto 0 auto;
    }

    .user {
      width: 300px;
      margin: 0 auto;
    }

    .button-box {
      width: 300px;
      margin-top: 20px;
      background: #eee;
    }
    .button-box.step2.first{
      margin-top: 20px;
    background-color: #eee;
    color: #606266;
    border-color: #dcdfe6;
    }

    .el-row {
      border: 1px solid #eee;
      margin-top: -1px;
      text-align: center;
      font-size: 14px;
      line-height: 50px;
    }

    .table-desc {
      line-height: 50px;
      font-size: 16px;
      color: #409EFF;
    }

    .table-cont {
      border-left: 1px solid #eee;
    }

    .button-box.step2 {
      margin-left: 50px;
      margin-top: 0;
          color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
    }

    .desc {
      line-height: 50px;
      font-size: 16px;
    }
    .err-text{
      width: 300px;
    }

    .desc>font {
      color: #409EFF;
    }

  </style>
  <script>
    import { mapState, mapActions } from 'vuex';
    import API from '@/api/account/account_unbundle.js';
    export default {
      data() {
        let that=this;
        var userIdfn = (rule, value, callback) => {
          that.userIdform.userId = that.userIdform.userId.replace(/(^\s*)|(\s*$)/g, "");
          value = that.userIdform.userId;
          if (value == '') {
            callback();
            that.userIdform.nextShow=false;
          } else {
            if (!/^[0-9-zA-Z]+$/.test(value)) {
             that.userIdform.nextShow=false;
             callback(new Error('请输入正确的应用系统号'));
           } else {
            callback();
            that.userIdform.nextShow=true;
          }
        }
      };
      return {
        userIdform: {
          nextShow:false,
            userId: '' //员工系统号
          },
          active: 0,
          initheader: {
            "curstyle": {
              "margin-bottom": "30px"
            },
            "content": "设备解绑"
          },
          info: {
            gomeId: '',
            name: '',
            id: '',
            post: '',
            tel: '',
          },
          formrules: {
            userId: [
            { validator: userIdfn, trigger: 'blur' }
            ]
          }
        }
      },

      computed: mapState({
        LOGINDATA: "LOGINDATA"
      }),
      methods: {
        initData() {

        },
    jumpto(to) { //跳转页面
      this.$router.push(to ? to : '/order/account/accountUnbundle');
    },
    /*初始值查询*/ 
    initNext() {
      let that = this;
      let userId = that.userIdform.userId;
     
      if (userId != ''  && that.userIdform.nextShow) {
        API.queryBindingEmployeeByAccount({
          account: userId
        }).then(function(data) {
          if (data.success && data.response) {
            that.info.gomeId = data.response.account;
            that.info.name = data.response.name;
            that.info.tel = data.response.phone;
            that.info.id = data.response.employeeId;
            that.info.post = data.response.positionName;
            that.active++;
          }else{
             that.$message({
                message: data.respMsg,
                type: 'warning'
              });

          }
        })
      }
    },
    /*第二步*/ 
    nextConfirmBtn() {
      let that = this;
      API.relieveBinding({
        account: that.info.gomeId
      }).then(function(data) {
        if (data.success && data.response) {
          that.active++;
          that.userIdform.userId='';

        }

      })
    },
    /*返回第一步*/ 
    returnFirst(){
      let that = this;
      that.active=0;
    },
    next() {
      let that = this;
      if (that.active++ == 2) that.active = 0;
    }
  }

}

</script>
