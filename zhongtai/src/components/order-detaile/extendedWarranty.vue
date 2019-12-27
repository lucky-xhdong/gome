<template>
  <div class="extended-warranty-box">
    <el-dialog 
      :visible.sync="insuranceDialogVisible" 
      width="800px"
      center
      :append-to-body="true"
      class="billing-dialog extended-warranty-dialog"
      >
      <div class="extended-warranty">
        <div class="title"><em>延保</em> <el-checkbox v-model="isShowTj">显示TJ</el-checkbox></div>
       
        <div class="content">
          <template  v-if="extendData && extendData.showGroupList && extendData.showGroupList.length>0">
            <div class="list-box" v-for="(data,index) in extendData.showGroupList" :key="index">
              <div class="category-title">{{data.showGroupName}}</div>
              <ul class="clearfloat" v-if="data && data.incrementSkuInfoList.length>0">
                <li class="list" 
                  :class="{active: list.isSelected}"
                  v-for="(list,idx) in data.incrementSkuInfoList" 
                  :key="idx"
                  @click="bindSelected(list)"
                  >
                  <div v-if="list.promotionType" class="promotionType">特惠</div>
                  <p class="name">{{list.displaySkuName}}</p>
                  <div class="inline-input">
                    <span class="price-symbol"> ¥</span>
                    <el-input v-model="list.newPrice"
                      @click.stop.native
                      @keyup.native="bindDealPrice(list,$event)"
                      @blur="bindBlurDealPrice(list)"
                    ></el-input>
                    <el-tooltip 
                      popper-class="billing-tip"
                      placement="top"
                      effect="light"
                      v-model="list.tip" :hide-after="10" :manual="true">

                      <div slot="content">{{list.priceWordTip}}</div>
                      <div class="to-tip"></div>
                    </el-tooltip>
                  </div>
                  <span class="billing-select-icon"></span>
                  <span v-show="isShowTj" v-on:click.stop class="tj">TJ {{list.rewardPrice | clearTailZero}}</span>
                  
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindConfirm" v-if="selectedData.length">确 定</el-button>
        <el-button type="primary" v-else disabled>确 定</el-button>
        <el-button @click="insuranceDialogVisible = false">取 消</el-button>
      </span>

    </el-dialog>
  </div> 
</template>

<script>
import API from "@/api/orderDetail/orderdetails";
import Env from '@/api/env';
import "@/common/tofixed";
export default {
    props: {
        pGoodsData:{
            type:Object
        },        
    },
    created: function() {
        // this.extendData = JSON.parse(JSON.stringify(this.pGoodsData))||{};
        this.dataInit();
    },
    data() {
        return {
            insuranceDialogVisible:true,
            myDialogVisible: this.insuranceDialogVisible,
            isShowTj: false,//是否显示提奖
            extendData:{},//初始化数据
        }
    },
    computed:{
        //选中的数据，做参数使用
        selectedData(){
            var paramArray =[];
            this.extendData.showGroupList && this.extendData.showGroupList.forEach((data, i) => {
                data.incrementSkuInfoList.forEach((item,j) => {                   
                    if(item.isSelected){
                        var paramInfo = {
                        "skuNo":item.skuNo, //增值服务skuNo
                        "showGroupId":data.showGroupId.toString(),//增值服务的二级分组
                        "incrementNewPrice":Number(item.newPrice),//改后的价格，如果没改价格，传原价
                        }
                        paramArray.push(paramInfo);
                    }
                
                });
            });
            return paramArray;
        }
    },
    watch:{
        pGoodsData:{
            handler:function(){
            //this.extendData = JSON.parse(JSON.stringify(this.pGoodsData))||{};
            this.dataInit();
            },
            deep: true
        }
    },
    methods: {
        //处理初始化数据
        dataInit(){
            // this.extendData = JSON.parse(JSON.stringify(this.pGoodsData.loadIncrementInfo.unCheckedIncrementInfo))||{};
            //this.checkedList = JSON.parse(JSON.stringify(this.pGoodsData.loadIncrementInfo.checkedIncrementInfo))||[];
            this.extendData = JSON.parse(JSON.stringify(this.pGoodsData))||{};
            this.extendData && this.extendData.showGroupList.forEach((data,i)=>{
                data.incrementSkuInfoList.forEach((item,j)=>{
                    //设置提示语不显示
                    this.$set(item,'tip',false);
                    this.$set(item,'priceWordTip','');
                    this.$set(item,'oldPrice',Number(item.newPrice));
                    this.$set(item,'rewardPrice',Number(item.reward));
                });
            });
        },
        //处理选择延保事件
        bindSelected(currentList) {
        
            this.dealInsuranceData(currentList);
        },
        //处理修改价格事件
        bindDealPrice(list, ev) {
            if(ev.keyCode == 13) {//回车事件
            this.bindBlurDealPrice(list);
            return false;
            }
            list.newPrice +='';
            var re = /[^\d\.]/g;

            //限制不能输入数字和.以外的字符
            if(re.test(list.newPrice)) {
            list.newPrice = list.newPrice.replace(re,'');
            }

            //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            if(list.newPrice.indexOf(".")< 0 && list.newPrice !=""){
                list.newPrice = parseFloat(list.newPrice) + ''; 
            } 

            //首位不能输入小数点
            if(list.newPrice.indexOf(".") == 0){ 
                list.newPrice = list.newPrice.replace(/^\./,''); 
            } 

            //限制只能输入一个小数点  
            if(list.newPrice.indexOf(".") != -1){  
                var subPrice = list.newPrice.substr(list.newPrice.indexOf(".")+1);  
                list.newPrice = list.newPrice.substr(0,list.newPrice.indexOf(".") + 1) + subPrice.replace(/\./g,'');
            } 
            
        },
        bindBlurDealPrice(list) {
            list.newPrice += '';
            list.servicePrice += '';
            var originalPrice = list.servicePrice;
            
            var isNum = !isNaN( Number(list.newPrice) )
            if(!isNum) {
            //list.newPrice = originalPrice;
                list.newPrice = list.oldPrice;
            }

            if(Number(list.newPrice) < Number(originalPrice)) {
            //list.newPrice = originalPrice;
                list.newPrice = list.oldPrice;

                list.tip = true;
                //list.priceWordTip = '不能低于限价';
                list.priceWordTip ='不能低于限价¥'+ Number(originalPrice).toFixed(2);
                setTimeout(()=> {
                    list.tip = false;
                },3000)
            }
            if(Number(list.newPrice) > 1000000) {
            //list.newPrice = originalPrice;
                list.newPrice = list.oldPrice;

                list.tip = true;
                list.priceWordTip = '不能高于1000000';
                setTimeout(()=> {
                    list.tip = false;
                },3000)
            }

            list.newPrice =  Number(list.newPrice).toFixed(2) + '';
            list.rewardPrice = list.commissionRate*Number(list.newPrice)*0.0001;
        // list.newPrice = list.newPrice.replace(/\.\d+$/,'.00');
        },
        //确定事件
        bindConfirm() {
            var param = JSON.parse(JSON.stringify(this.pGoodsData.addIncrement));

            param.increments = this.selectedData;
            //console.log(param);

            API.AddSellerBill(param).then((data) => {
            if(data.success) {
                this.myDialogVisible = false;
                var newUrl = "//mpf"+Env.cookieDomain+"/service/purchaseExtension/?memberId="+data.response.memberId+"&memberCard="+data.response.memberCard+"&temporaryCardFlag="+data.response.temporaryCardFlag+"&siteType="+data.response.siteType+"&sellerNum="+data.response.sellerNum+"&storeCode="+data.response.storeCode+"&shippingGroupId="+param.shippingGroupId;
                window.location.href=newUrl;
            }else {
                this.$message({
                showClose: true,
                message: data.respMsg,
                type: 'warning'
                });
            }
            })
        },
        //点击取消事件
        bindCancel(){
            this.dataInit();
            //this.insuranceDialogVisible = false;
        // this.extendData =JSON.parse(JSON.stringify(this.pGoodsData.loadIncrementInfo.unCheckedIncrementInfo));
            
        },
        //处理保险数据，增加值，和选择保险时的数据操作
        dealInsuranceData(currentlist) {

            var currentType = currentlist.serviceType; //当前选中的服务类型
            
        //判断是否互斥
            this.extendData.showGroupList.forEach((data, i) => {
                data.incrementSkuInfoList.forEach((item,j) => {
                    
                    //设置提示语不显示
                    // this.$set(item,'tip',false);
                    // this.$set(item,'priceWordTip','');
                
                    //分组内互斥，组之间不互斥
                    if(currentType == item.serviceType){
                        if(currentlist == item){
                            currentlist.isSelected = Number(!currentlist.isSelected);
                        }else{
                            item.isSelected = 0;
                        }
                    }
                })
            })
        }
    },
    filters: {
    //去尾0
        clearTailZero(value) {
            return parseFloat(Number(value).toFixed(2).toString());
        }
    }
};
</script>

<style lang="stylus">
  .extended-warranty-dialog .el-input--small .el-input__inner {
    text-align: center;
    text-overflow: clip;
    padding:0 5px 0 18px;
    width:72px;
  }
  .extended-warranty-dialog .el-input__inner{
    height: 28px;
    line-height: 28px;
    padding: 0 5px 0 18px;
    width: 72px;
  }
</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  .clearfloat:after {
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
  }
  .extended-warranty-box {
  }
  .extended-warranty-dialog {
    .extended-warranty {
      margin-top: -20px;
      margin-bottom: -20px;
    }
    .title {
      line-height: 32px;
      margin-bottom: 5px;
      em {
        margin-right: 10px;
        font-style: normal;
      }
    }
    .content {
      padding-left: 40px;
    }
    .category-title {
      line-height: 20px;
      padding-bottom:5px;
    }
    .list-box {
    }
    .list {
      position: relative;
      float: left;
      line-height: 28px;  
      padding: 5px;
      min-width: 335px;
      text-align: center;
      border: 1px solid $b-c-g;
      margin-right: 20px;
      margin-bottom: 20px;
      box-sizing: border-box;
      cursor: pointer;
      .promotionType {
        display: inline-block;
        padding:0 5px;
        font-size:12px;
        background: #fbebec;
        margin-right: 5px;
      }
      .name {
        display: inline-block;
        margin-right: 5px;
        max-width:184px;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;
        text-overflow: ellipsis;
      }
      .inline-input {
        position: relative;
        display: inline-block;
        width: 60px;
        text-align: center;
      }
      .price-symbol {
        position: absolute;
        left: 10px; 
        top: 1px;
        line-height: 28px;
        z-index: 10;
        color: #909399;
        font-size: 13px;
      }
      .priceError {
        position: absolute;
        left: 0;
        bottom: -14px;
        font-size: 12px;
        line-height: 1;
        text-align: center;
        color: #f56c6c;
      }
      .tj {
        position: absolute;
        right: 0px;
        top: -18px;
        font-size: 12px;
        line-height: 16px;
        border: 1px solid $b-c-g;
        border-bottom: none;
        padding: 0 5px;
        cursor: default;
      }
      &.active {
        border-color: #409EFF;
        .billing-select-icon {
          display: block;
        }
      }
      &:hover {
        .delete {
          display: block;
        }
      }
      .to-tip {
        position: absolute;
        left: 0;
        top: 8px;
        width: 60px;
      }
    }
  }
  .dialog-footer {
    margin-top: 20px;
    margin-left: -60px;
    text-align: center;
  }

  
  .extended-warranty-dialog .content{
    border:none;
    padding:0;
  }
</style>

