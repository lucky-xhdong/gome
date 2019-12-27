<template>
  <!--  <div  @click.stop="changename">{{LOGINDATA.loginName}}</div> -->
  <div class="container">
    <el-button v-if="LOGINDATA.orderplatform_creatfiles_bao" type="primary" size="small" @click.stop="submitForm('rulesmesinfo')">保存</el-button>
    <div class="tit-box">
      <el-form :inline="true" ref="labelSearch" :rules="selectrules" :model="labelSearch" class="search" width="990px">
        <el-form-item label="订单号：" prop="orderId">
          <el-input v-model="labelSearch.orderId" placeholder="请输入订单号" maxlength="20" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="会员卡号：" prop="vipId">
          <el-input v-model="labelSearch.vipId" placeholder="请输入会员卡号" maxlength="30" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="配送单号：" prop="deliveryId">
          <el-input v-model="labelSearch.deliveryId" placeholder="请输入配送单号" maxlength="20" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名：" prop="name">
          <el-input v-model="labelSearch.name" placeholder="请输入收货人姓名" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="收货人手机号：" prop="phone">
          <el-input v-model="labelSearch.phone" placeholder="请输入手机号" maxlength="11" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item>
  <!--       <el-form-item label="导购员编号：" prop="salesId">
          <el-input v-model="labelSearch.salesId" placeholder="请输入导购员号" maxlength="20" auto-complete="off" size="mini" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="订单状态：" prop="orderStatus">
         <el-select v-model="labelSearch.orderStatus.value" placeholder="请选择" size="mini">
          <el-option
          v-for="item in labelSearch.orderStatus.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="下单时间：" prop="dateEvnet" style="width:600px;">
      <el-date-picker class="timebox" type="date" placeholder="选择开始日期" v-model="labelSearch.startDate" value-format="yyyy-MM-dd" :picker-options="startDateEvent" size="mini" auto-complete="off"></el-date-picker><span class="data-span">-</span>
      <el-date-picker class="timebox" type="date" placeholder="选择结束日期" v-model="labelSearch.endDate" value-format="yyyy-MM-dd" :picker-options="endDateEvent" size="mini" auto-complete="off"></el-date-picker>
    </el-form-item>
  </el-form>
  <div class="button-box">
    <el-button type="primary" size="mini" v-on:click="getReset" class="button   reset">重置</el-button>
    <el-button type="primary" size="mini" v-on:click="getSelect" class="button  right">查询</el-button>

  </div>
</div>
<!--     <p class="error-text" v-if="isErrorTxt">请至少输入一个查询条件</p> -->
<div class="table-box">
  <el-table :data="searchList" stripe border v-loading="listLoading" :default-sort="{prop: 'list.orderId', order: 'list.descending'}" style="width: 100%">
    <el-table-column prop="orderId" fixed label="订单号" sortable width="180">
    </el-table-column>
    <el-table-column prop="memberCardNo" sortable label="会员卡号" width="180">
    </el-table-column>
    <el-table-column prop="shippingGroupId" sortable label="配送单号">
    </el-table-column>
<!--     <el-table-column prop="sales" sortable label="配送单号">
</el-table-column> -->
<el-table-column prop="receiverName" sortable label="收货人姓名">
</el-table-column>
<el-table-column prop="receiverPhoneNo" sortable label="收货人手机号">
</el-table-column>
<el-table-column prop="skuNo" sortable label="商品代码">
</el-table-column>
<el-table-column prop="skuName" sortable label="商品名称">
</el-table-column>
<el-table-column prop="inventoryStateDesc" sortable label="库存状态">
</el-table-column>
<el-table-column prop="quantity" sortable  label="数量">
</el-table-column>
<el-table-column prop="price" sortable label="单价">
</el-table-column>
<el-table-column prop="submmittedDate" sortable label="下单时间">
</el-table-column>
<el-table-column prop="deliveryMethod" sortable label="送货方式">
</el-table-column>
<el-table-column prop="installMethod" sortable label="安装方式">
</el-table-column>
<el-table-column prop="orderState" sortable label="订单状态">
</el-table-column>
<el-table-column fixed="right" prop="status" label="操作">
  <template slot-scope="scope">
    <el-button class="scope-btn1" v-if="scope.row.queryFlag==1  && LOGINDATA.orderplatform_creatfiles_explorer" @click="handleLook(scope.$index, scope.row)" type="text" size="small">查看</el-button>
    <el-button class="scope-btn2" v-if="scope.row.updateFlag==1 && LOGINDATA.orderplatform_creatfiles_modify" @click="handleEdit(scope.$index, scope.row)" type="text" size="small">修改</el-button>
  </template>
</el-table-column>
</el-table>
<div class="block pagebox" v-if="pageShow">
  <el-pagination background @current-change="handleCurrentChange" :current-page="pageData.currentPage" :page-size="pageData.pageSize" layout="total,prev, pager, next, jumper" :total="pageData.totalSize">
  </el-pagination>
</div>
</div>
</div>
</template>
<style>
  .tit-box {
    width: 100%;
    padding: 20px 0;
    border: 1px solid #ebeef5;
  }

  .timebox {
    width: 200px;
  }

  .tit-box .el-form-item {
    width: 500px;
  }

  .tit-box .el-form-item__label {
    width: 120px;
  }


  .data-span {
    padding: 0 10px;
  }

  .button-box {
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }

  .button {
    display: inline-block;
    font-weight: 500;
  }

  .button.right {
    margin-left: 150px;
  }

  .button.reset {
    background: #fff;
    color: #606266;
    border-color: #eee;
  }

  .el-input__inner {
    font-size: 14px;
    color: #606266;
  }

  .table-box {
    width: 100%;
    text-align: center;
    margin-top: 50px;
  }

  .el-table th,
  .el-table tr {
    color: #606266;
    font-size: 12px;
  }

  .el-table th.is-leaf {
    background: #eef6ff;
    color: #909399;
    font-size: 14px;
  }

  .table-box .el-table th>.cell {
    text-align: center;
    color: #606266;
    font-size: 12px;
  }

  .pagebox {
    text-align: right;
    margin-top: 20px;
  }




/*  .el-button.scope-btn1{
    margin-right: 10px;
  }*/

</style>
<script>
  import { mapState, mapActions } from 'vuex';
  import util from '@/common/util.js';
  import API from '@/api/creatFiles/creatFiles_select.js';
  var cacheSearch = {
  orderId: "", //订单号
  vipId: "", //会员卡号
  deliveryId: "", //配送单号
  // salesId:"",//导购员单号
  name: "", //收货人姓名
  phone: "", //收货人电话
  orderStatus:{
   value:"",
   options:[
   {
    value: '0',
    label: '全部'
  }, {
    value: '1',
    label: '待收款'
  }, {
    value: '2',
    label: '待自提'
  }, {
    value: '3',
    label: '待收货'
  }, {
    value: '4',
    label: '已完成'
  }, {
    value: '5',
    label: '已删单'
  }
  ]
  },//订单状态
  startDate: "", //开始时间
  endDate: "", //结束时间
  // currentPage: 1, //当前页
  // pageSize: 10
};
export default {
  data() {
    var that = this;
    var receiverOrderIdfn = (rule, value, callback) => {
      that.labelSearch.orderId = that.labelSearch.orderId.replace(/(^\s*)|(\s*$)/g, "");
      value = that.labelSearch.orderId;
      if (value == '') {
        callback();
        that.select = true;
      } else {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error('请输入正确的订单号'));
          that.select = false;
        } else {
          callback();
          that.select = true;
        }

      }
    };
    var receiverVipIdfn = (rule, value, callback) => {
      that.labelSearch.vipId = that.labelSearch.vipId.replace(/(^\s*)|(\s*$)/g, "");
      value = that.labelSearch.vipId;
      if (value == '') {
        callback();
        that.select = true;
      } else {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error('请输入正确的会员卡号'));
          that.select = false;
        } else {
          callback();
          that.select = true;
        }

      }
    };
    
    // var receiverSalesIdfn = (rule, value, callback) => {
    //   that.labelSearch.salesId = that.labelSearch.salesId.replace(/(^\s*)|(\s*$)/g, "");
    //   value = that.labelSearch.salesId;
    //   if (value == '') {
    //     callback();
    //     that.select = true;
    //   } else {
    //     if (!/^[0-9]+$/.test(value)) {
    //       callback(new Error('请输入正确的导购单号'));
    //       that.select = false;
    //     } else {
    //       callback();
    //       that.select = true;
    //     }

    //   }
    // };
    
    var receiverDeliveryIdfn = (rule, value, callback) => {
      that.labelSearch.deliveryId = that.labelSearch.deliveryId.replace(/(^\s*)|(\s*$)/g, "");
      value = that.labelSearch.deliveryId;
      if (value == '') {
        callback();
        that.select = true;
      } else {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error('请输入正确的配送单号'));
          that.select = false;
        } else {
          callback();
          that.select = true;
        }

      }
    };
    var receiverNamefn = (rule, value, callback) => {
      that.labelSearch.name = that.labelSearch.name.replace(/(^\s*)|(\s*$)/g, "");
      value = that.labelSearch.name;
      let len = value.length;
      if (value == '') {
        callback();
        that.select = true;
      } else {
        // for (var i = 0; i < value.length; i++) {
        //   let a = value.charAt(i);
        //   if (a.match(/[^\x00-\xff]/ig) != null) {
        //     len += 2;
        //   } else {
        //     len += 1;
        //   }
        // };
        if ((len > 0 && len > 30) || (len > 0 && len < 2)) {
          callback(new Error("姓名长度在2-30个字符"));
          that.select = false;
        } else if (!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\·\_]+$/.test(value)) {
          callback(new Error("不能输入特殊字符"));
          that.select = false;
        } else {
          callback();
          that.select = true;
        }

      }
    };
    var receiverPhonefn = (rule, value, callback) => {
      that.labelSearch.phone = that.labelSearch.phone.replace(/(^\s*)|(\s*$)/g, "");
      value = that.labelSearch.phone;
      if (value == '') {
        callback();
        that.select = true;
      } else if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value)) {
        callback(new Error('输入的手机号格式不正确'));
        that.select = false;
      } else if (value.length > 0 && value.length < 11) {
        callback(new Error('手机号必须为11位'));
        that.select = false;
      } else {
        callback();
        that.select = true;
      }
    };
    var receiverOrderStatusFn=(rule, value, callback) => {

      if (value == '') {
        callback();
        that.select = true;
      } else {
        callback();
        that.labelSearch.orderStatus.value = value;
        that.select = true;
      }
    };
    var receiverDateFn = (rule, value, callback) => {
      var endDate = that.labelSearch.endDate;
      var startDate = that.labelSearch.startDate;
      if (endDate == '' && startDate == '') {
        callback();
        that.select = true;
      } else {
        if (endDate == '') {
          callback('请输入结束时间');
          that.select = false;
        } else if (startDate == '') {
          callback('请输入开始时间');
          that.select = false;
        } else {
          callback();
          that.select = true;
        }

      }

    };


    return {
      labelSearch: {
        orderId: "", //订单号
        vipId: "", //会员卡号
        deliveryId: "", //配送单号
        // salesId:"",//导购员单号
        name: "", //收货人姓名
        phone: "", //收货人电话
        orderStatus:{
          value:"",
          options:[
          {
            value: '0',
            label: '全部'
          }, {
            value: '1',
            label: '待收款'
          }, {
            value: '2',
            label: '待自提'
          }, {
            value: '3',
            label: '待收货'
          }, {
            value: '4',
            label: '已完成'
          }, {
            value: '5',
            label: '已删单'
          }
          ]
        },//订单状态
        startDate: "", //开始时间
        endDate: "" //结束时间
      },
      listLoading: false,
      select: true,
      pageData: {
        currentPage: 1, //当前页
        pageSize: 10, //每页显示几条
        totalPage: 1, //总页数
        totalSize: 1, //总共条目
      },
      pageShow: false,
      searchList: [],
      initheader: {
        "curstyle": { //头数据
          "margin-bottom": "30px"
        },
        "content": "查询条件"
      },
      selectrules: {
        orderId: [
        { validator: receiverOrderIdfn, trigger: 'blur' }
        ],
        vipId: [
        { validator: receiverVipIdfn, trigger: 'blur' }
        ],
        deliveryId: [
        { validator: receiverDeliveryIdfn, trigger: 'blur' }
        ],
        // salesId: [
        // { validator: receiverSalesIdfn, trigger: 'blur' }
        // ],
        name: [
        { validator: receiverNamefn, trigger: 'blur' }
        ],

        phone: [
        { validator: receiverPhonefn, trigger: 'blur' }
        ],
        orderStatusEvent:[
        {validator: receiverOrderStatusFn, trigger: 'change'}
        ],
        dateEvnet: [
        { validator: receiverDateFn, trigger: 'blur' }
        ]
      },
      startDateEvent: {
        disabledDate(time) {
          if (that.labelSearch.endDate != "" && that.labelSearch.endDate != null) {
            var date1 = new Date(that.labelSearch.endDate);
            var date2 = new Date(date1);
            date2.setDate(date1.getDate() - 30);
            return time.getTime() < date2.getTime() || time.getTime() > date1 || time.getTime() > new Date();
          } else {
            that.labelSearch.endDate = '';
            return time.getTime() > new Date();
          }
        }
      },
      endDateEvent: {
        disabledDate(time) {
          var date3 = new Date();
          date3.setDate(date3.getDate() + 1);
          if (that.labelSearch.startDate != "" && that.labelSearch.startDate != null) {
            var date1 = new Date(that.labelSearch.startDate);
            var date2 = new Date(date1);

            date2.setDate(date1.getDate() + 30);

            return time.getTime() > date2.getTime() || time.getTime() < date1 || time.getTime() > date3.getTime();
          } else {
            that.labelSearch.startDate = '';
            return time.getTime() > date3.getTime();
          }
        }
      }
    }
  },
  mounted() {
    let that = this;
    that.initData();
  },
  activated() {
    let that = this;
    if (cacheSearch.orderId != '' || cacheSearch.vipId != '' || cacheSearch.deliveryId != '' || cacheSearch.name != '' || cacheSearch.phone != '' || (cacheSearch.startDate != '' && cacheSearch.endDate != '' )) {
      this.getCacheSelect();
    }
  },
  computed: mapState({
    LOGINDATA: "LOGINDATA"
  }),
  methods: {
    initData() {
      let that = this;

    },
    jumpto(to) { //跳转页面
      this.$router.push(to ? to : '/order/screatFileSelect');
    },
    /*修改*/
    handleEdit(index, row) {
      let that = this;
      that.$router.push('/order/creatfilesdetaile/' + row.storeCode + '-' + row.orderId + '-' + row.commerceItemId+'-'+row.shippingGroupId + '-2');

    },
    /*查看*/
    handleLook(index, row) {
      let that = this;

      window.open('/order/creatfilesdetaile/' + row.storeCode + '-' + row.orderId + '-' + row.commerceItemId +'-'+row.shippingGroupId+ '-0');


    },
    /*切换当前页*/
    handleCurrentChange(val) {
      let that = this;
      that.pageData.currentPage = val;
      that.getCacheSelect();

    },
    /*点击查询*/
    getSelect() {
      let that = this;
      if ((that.labelSearch.orderId != '' || that.labelSearch.vipId != '' || that.labelSearch.deliveryId != ''  || that.labelSearch.name != '' || that.labelSearch.phone != '' || that.labelSearch.orderStatus.value != '' || (that.labelSearch.startDate != '' && that.labelSearch.endDate != '')) && that.select) {
        that.pageData = {
          currentPage: 1, //当前页
          pageSize: 10, //每页显示几条
          totalPage: 1, //总页数
          totalSize: 1, //总共条目
        };
        that.listLoading = true;
        that.searchList = [];
        API.queryArchiveSelect({
          orderId: that.labelSearch.orderId,
          memberCardNo: that.labelSearch.vipId,
          shippingGroupId: that.labelSearch.deliveryId,
          // salesId:that.labelSearch.salesId,
          receiverName: that.labelSearch.name,
          receiverPhoneNo: that.labelSearch.phone,
          orderState:that.labelSearch.orderStatus.value,
          startSubmittedDate: that.labelSearch.startDate,
          endSubmittedDate: that.labelSearch.endDate,
          currentPage: that.pageData.currentPage,
          pageSize: that.pageData.pageSize,

        }).then(function(data) {
          that.listLoading = false;
          if(data.success){
            if(data.response != null){
              if (data.response.list.length > 0) {
               that.pageShow = true;
               for (var item of data.response.list) {
                item.submmittedDate = that.format(item.submmittedDate);
              }
              cacheSearch.orderId = that.labelSearch.orderId;
              cacheSearch.vipId = that.labelSearch.vipId;
              cacheSearch.deliveryId = that.labelSearch.deliveryId;
              // cacheSearch.salesId = that.labelSearch.salesId;
              cacheSearch.name = that.labelSearch.name;
              cacheSearch.phone = that.labelSearch.phone;
              // cacheSearch.orderState.=that.labelSearch.orderState;
              cacheSearch.startDate = that.labelSearch.startDate;
              cacheSearch.endDate = that.labelSearch.endDate;
              that.searchList = data.response.list;
              that.pageData.totalSize = data.response.pager.totalSize;
              that.pageData.totalPage = data.response.pager.totalPage;

            }else{
              that.pageShow = false;
              that.$message({
                message: data.respMsg,
                type: 'warning'
              });
              that.pageData.currentPage = 1;
              that.searchList = [];
            }
          }else{
            that.pageShow = false;
            that.searchList = [];
            that.pageData.currentPage = 1;
          }
        } else {
          that.pageShow = false;
          that.$message({
            message:data.respMsg,
            type: 'warning'
          });
          that.searchList = [];
          that.pageData.currentPage = 1;
            // that.pageData.currentPage = 1;

          }
        })
      } else {
        if (that.select) {
          that.listLoading = false;
          that.pageShow = false;
          that.$message({
            message: '请输入至少一个查询条件',
            type: 'warning'
          });
        }

      }


      //NProgress.start();

    },
    /*点击分页*/
    getCacheSelect() {
      let that = this;
      that.listLoading = true;
      API.queryArchiveSelect({
        orderId: cacheSearch.orderId,
        memberCardNo: cacheSearch.vipId,
        shippingGroupId: cacheSearch.deliveryId,
        // salesId:cacheSearch.salesId,
        receiverName: cacheSearch.name,
        receiverPhoneNo: cacheSearch.phone,
        orderState:that.labelSearch.orderStatus.value,
        startSubmittedDate: cacheSearch.startDate,
        endSubmittedDate: cacheSearch.endDate,
        currentPage: that.pageData.currentPage,
        pageSize: that.pageData.pageSize,

      }).then(function(data) {
        that.listLoading = false;
        if(data.success){
          if( data.response != null){
            that.pageShow = true;
            if (data.response.list.length > 0) {
              for (var item of data.response.list) {
                item.submmittedDate = that.format(item.submmittedDate);
              }
              that.searchList = data.response.list;
              that.pageData.totalSize = data.response.pager.totalSize;
              that.pageData.totalPage = data.response.pager.totalPage;
            }
          }else{
           that.searchList =[];
         }
       }else{
         that.$message({
          message: data.respMsg,
          type: 'warning'
        });
       }
     })

    },
    format(date) {
      date = new Date(date);
      var Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
      if (M < 10) {
        M = "0" + M;
      }
      if (D < 10) {
        D = "0" + D;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return date = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    /*点击清空*/
    getReset() {
      let that = this;
      that.labelSearch = {
        orderId: "", //订单号
        vipId: "", //会员卡号
        deliveryId: "", //配送单号
        // salesId:"",//导购单号
        name: "", //收货人姓名
        phone: "", //收货人电话
        orderStatus:{
         value:"",
         options:[
         {
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '待收款'
        }, {
          value: '2',
          label: '待自提'
        }, {
          value: '3',
          label: '待收货'
        }, {
          value: '4',
          label: '已完成'
        }, {
          value: '5',
          label: '已删单'
        }
        ]
        },//订单状态
        startDate: "", //开始时间
        endDate: "" //结束时间
      };
      that.listLoading = false;
      // that.pageData = {
      //   currentPage: 1, //当前页
      //   pageSize: 10, //每页显示几条
      //   totalPage: 1, //总页数
      //   totalSize: 1, //总共条目
      // };
      // that.pageShow = false;
      // that.searchList = [];
      that.$refs['labelSearch'].resetFields();
    }

  }

}

</script>
