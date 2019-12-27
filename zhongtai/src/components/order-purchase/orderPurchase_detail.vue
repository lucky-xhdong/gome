<template>
<div>
<div v-if="error" align="center">{{respMsg}}</div>
<div v-if="!error"  class="order_detailsbox">
    <div class="order_details_l">
        <g-header v-model="lefttitle"></g-header>       
        <div class="order_details_cont">
            <div class="content_title">商品信息</div>
                <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
                    <div class="el-table__body-wrapper is-scrolling-none">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header"   style="width: 100%;">
                            <thead class="has-gutter">
                                <tr class="">
                                    <th colspan="1" rowspan="1" class="el-table_2_column_4  is-center   is-leaf" >
                                        <div class="cell">商品名称</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_5  is-center   is-leaf">
                                        <div class="cell">商品编码</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_6  is-center   is-leaf" >
                                        <div class="cell">价格</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_7  is-center   is-leaf">
                                        <div class="cell">数量</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_8  is-center   is-leaf">
                                        <div class="cell">品牌</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_10  is-center   is-leaf">
                                        <div class="cell">销售方式</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_11  is-center   is-leaf">
                                        <div class="cell">配送方式</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_13  is-center   is-leaf">
                                        <div class="cell">安装方式</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_2_column_14  is-center   is-leaf" width="105">
                                        <div class="cell">操作</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="el-table__body" v-for="(list,index) in  orderDetail.skuList" :key="index">
                                <tr class="el-table__row">
                                    <td class="el-table_2_column_4 is-center">
                                        <el-popover trigger="hover" placement="top">
                                            <p style="max-width:520px;word-break: break-all; word-wrap:break-word;">{{list.skuName}}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <div class="cell" v-if="list.type==0 || list.type==4">{{list.skuName}}</div>
                                                <div class="cell" v-else-if="list.type==2"><el-tag size="mini">套装</el-tag>{{list.skuName}}</div>
                                                <div class="cell" v-else-if="list.type==3"><el-tag type="success" size="mini">预售</el-tag>{{list.skuName}}</div>
                                                <div class="cell" v-else-if="list.type==5"><el-tag type="danger" size="mini">赠品</el-tag>{{list.skuName}}</div>
                                                <!-- <div class="cell" v-else-if="list.type==4"><el-tag type="info" size="mini">延保</el-tag>{{list.skuName}}</div> -->
                                            </div>
                                        </el-popover>
                                    </td>
                                    <td class="el-table_2_column_5 is-center ">
                                        <div class="cell">{{list.skuNo}}</div>
                                    </td>
                                    <td class="el-table_2_column_6 is-center ">
                                        <div class="cell">{{list.price}}</div>
                                    </td>
                                    <td class="el-table_2_column_7 is-center ">
                                        <div class="cell">{{list.quantity}}</div>
                                    </td>
                                    <td class="el-table_2_column_8 is-center ">
                                        <div class="cell">{{list.brandName}}</div>
                                    </td>
                                    <td class="el-table_2_column_10 is-center ">
                                        <div class="cell">{{list.saleMethod}}</div>
                                    </td>
                                    <td class="el-table_2_column_11 is-center ">
                                        <div class="cell">{{list.deliveryMethod}}</div>
                                    </td>
                                    <td class="el-table_2_column_13 is-center ">
                                        <div class="cell">{{list.installMethod}}</div>
                                    </td>
                                    <td class="el-table_2_column_14 is-center " width="120px">
                                        <div class="cell">
                                            <el-button v-if="list.conginee" type="text" size="mini" class="checkInfo" @click="list.show=!list.show" v-bind:class="list.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'">查看收货信息</el-button>   
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="list.show && list.conginee" class="detail_row el-table__row" >
                                    <td colspan="9" style="background:#EBEEF5">
                                        <div class="el-table_2_column_4">
                                            <div class="info">收货人</div>
                                            <div class="info">电话</div>
                                            <div class="info">收货地址</div>
                                        </div>
                                        <div class="el-table_2_column_4" >
                                            <div class="info">{{list.conginee.consigneeName}}</div>
                                            <div class="info">{{list.conginee.consigneePhone}}</div>
                                            <div class="info">{{list.conginee.consigneeAddress}}</div>
                                        </div>
                                       
                                    </td>
                                </tr>
                            </tbody>
                           
                        </table>
                    </div>
                </div>
        </div>
        <!-- 导购单小计 -->
        <div class="order_details_cont settlement">
            <div class="ml40" style="float:right;margin-right:40px;">
                <div class="purchaseOrder"><span class="mr20">导购单小计：</span><span style="float:right;font-family:'Microsoft Yahei'">¥{{orderDetail.guiderOrderMoney}}</span></div>
                <div v-if="orderDetail.guiderType==3 && orderDetail.balanceAmount!=0">
                    <span class="mr20">定金金额：</span><span  style="float:right;font-family:'Microsoft Yahei'">¥{{orderDetail.depositAmount}}<span v-if="orderDetail.depositExpandAmount!=0">(抵扣 ¥{{orderDetail.depositExpandAmount}})</span></span>
                </div>
                <div v-if="orderDetail.guiderType==3 && orderDetail.balanceAmount!=0">
                    <span class="mr20">尾款金额：</span><span  style="float:right;font-family:'Microsoft Yahei'">¥{{orderDetail.balanceAmount}}</span>
                </div>
                <div v-if="orderDetail.guiderType==3 && orderDetail.balanceAmount==0">
                    <span class="mr20">全额定金：</span><span  style="float:right;font-family:'Microsoft Yahei'">¥{{orderDetail.depositAmount}}</span>
                </div>
                <div v-if="orderDetail.guiderType==2">
                    <span class="mr20">套装总价：</span><span  style="float:right;font-family:'Microsoft Yahei'">¥{{orderDetail.packageAmount}}</span>
                </div>
                <div class="coupons" v-if="orderDetail.giftInfoList[0]" style="">
                    <span class="mr20">{{orderDetail.giftInfoList[0].giftName}}：</span>
                    <span  style="float:right" >{{orderDetail.giftInfoList[0].giftAmount}}</span>
                </div>
                <div class="sendBean" v-if="orderDetail.giftInfoList[1]">
                    <span class="mr20">{{orderDetail.giftInfoList[1].giftName}}：</span>
                    <span  style="float:right;">{{orderDetail.giftInfoList[1].giftAmount}}</span>
                </div>
            </div>
        </div>
    </div>
    <!-- 右侧导购单信息 -->
   <div class="order_details_r">
        <g-header v-model="righttitle"></g-header>
        <div class="orderinfo">
            <div class="item">
                <span class="label">导购单号： </span> 
                <div class="info-rcol">{{orderDetail.guiderOrderId}}</div> 
            </div>
            <div class="item">
                <span class="label">加购时间：</span> 
                <div class="info-rcol">{{orderDetail.guiderOrderTime | formatDate}}</div> 
            </div>
            <div class="item">
                <span class="label">导购单失效时间：</span> 
                <div class="info-rcol">{{orderDetail.expireTime | formatDate}}</div> 
            </div>
        </div>
        <div class="orderinfo">
            <div class="item">
                <span class="label">会员卡号： </span> 
                <div class="info-rcol">{{orderDetail.memberCardNo}}</div> 
            </div>
            <div class="item" v-if="orderDetail.memberPhone">
                <span class="label">会员电话：</span> 
                <div class="info-rcol">{{orderDetail.memberPhone}}<el-button type="primary" size="mini" class="ml10" v-if="flag || LOGINDATA.orderplatform_orderpurchase_check" @click="seeNumber">查看</el-button></div> 
            </div>
        </div>
        <div class="orderinfo">
            <div class="item">
                <span class="label">导购员编号： </span> 
                <div class="info-rcol">{{orderDetail.guiderCode}}</div> 
            </div>
            <div class="item">
                <span class="label">导购员姓名：</span> 
                <div class="info-rcol">{{orderDetail.guiderName}}</div> 
            </div>
            <div class="item">
                <span class="label">所属门店：</span> 
                <div class="info-rcol">{{orderDetail.storeName}}</div> 
            </div>
        </div>
        <div class="orderinfo" v-if="orderDetail.entryCode || orderDetail.remark">
            <div class="item">
                <div class="label" style="width:40px">备注：</div> 
                <div class="info-rcol" v-if="orderDetail.entryCode" style="width:220px;padding-right:10px">{{orderDetail.entryCode}}</div> 
            </div>
            <div class="item" v-if="orderDetail.remark">
                <span class="label" style="width:40px"></span> 
                <div class="info-rcol" style="width:220px; padding-right:10px">{{orderDetail.remark}}</div> 
            </div>
        </div>
    </div> 
</div>
</div>
</template>
<script>
  import {mapState,mapActions} from  'vuex';
  import API from '@/api/order-purchase/orderPurchase_detail';
  import { formatDate } from "@/common/time";
    export default{
        data(){
            return {
                respMsg:'',
                error:false,
                dispatchingmesg:true,
                lefttitle:{
                    content:"导购单详情" 
                },
                righttitle:{
                    content:"加购单信息" 
                },
                orderDetail:{
                    guiderOrderId: "",
                    guiderOrderTime: "",
                    expireTime: "",
                    memberCardNo: "",
                    memberName: "",
                    memberPhone: "",
                    guiderCode: "",
                    guiderName: "",
                    storeName: "",
                    entryCode: "",
                    remark: "",
                    guiderOrderMoney: "",
                    skuList:[],
                    payInfoList:{},
                    giftInfoList:{}
                    
                },
                flag:true,
                msg:{
                     guiderOrderId: this.$route.query.guiderOrderId,
                     guiderCode: this.$route.query.guiderCode,
                },
                
            }
        },
        computed:{
            ...mapState({//vuex取值
                LOGINDATA:"LOGINDATA"
            }), 
        },
        created(){
            var that=this;
            //获取导购单基本信息
            API.queryGuiderOrderDetail(that.msg).then(function(data){
                if(data.response){
                    data.response.skuList.forEach(function(list){
                    list.show=false;
                    });
                    that.orderDetail=data.response;
                }else{
                    that.error=true;
                    that.respMsg=data.respMsg;
                }
                
            })
            var data=new Date().getTime();
        },
        methods:{
            //点击查看按钮显示完整手机号
            seeNumber(){
                var that=this;
                API.queryDetailPageMemberPhone(that.msg).then(function(data){
                    if(data.response){
                        that.orderDetail.memberPhone=data.response.phone;
                        that.flag=false;
                    }
                    
                })

            }
           
        },
        filters: {
            //时间格式转换
            formatDate(time) {
                if(time!=null){
                    let date = new Date(time);
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
                
            }
        }

    }
</script>
<style>
.info{
    width: 30%;
    float: left;
    text-align: center;
    line-height: 40px;
}
.mt20{
    margin-top:20px;
}
.order_search_box{
    border: 1px solid #E4E7ED;
    padding: 20px 10px 5px;
    margin-bottom:20px;
    
}
.order_detailsbox{
    position: relative;
    
}
.order_details_l{
    margin-right:320px;
    border:1px solid #E4E7ED;
    min-height: 800px;
    
}
.order_details_r{
    position: fixed;
    width: 300px;
    border: 1px solid #e4e7ed;
    right: 20px;
    top: 20px;
}
.orderinfo,.payinfor{
    width:280px;
    margin:10px auto;
    background:#f2f6fc;
    color:#303133;
    padding:5px 0;
}
.orderinfo .item{
    width:280px;
    display: flex;
    min-height:30px;
    line-height:30px;
}
.orderinfo .item .label{
    padding-left:10px
}
.ml10{
    margin-left: 10px;
    
}
.mr20{
    margin-right:20px;
}
.mb10{
    margin-bottom:10px;
}
.payinfor{
    background:#EBEEF5;
    font-size:12px; 
}
.payinfor .item{
    width:240px;
    display: flex;
    height:24px;
    line-height:24px;
}
.payinfor .item .label{
    flex:0 0 100px;
    text-align:right;
}
.payinfor .item .info-rcol{
    flex:1;
    text-align:left;
}
.el-collapse-item__header{
    height:35px;
    line-height:35px;
    padding-left:15px;
    background:#EBEEF5;
    border-bottom:1px solid #E4E7ED;
    color: #303133;
}
.el-collapse-item__arrow{
    height:35px;
    line-height:35px;
}
.order_details_cont{
    padding:20px;
}
/*配送单下拉*/
.content{
    border:1px solid #E4E7ED;
    padding:10px;
}
.states{
    display:flex;   
    border-bottom:1px solid #409EFF;
    height: 39px;
    overflow:hidden;
    margin-bottom:20px;
}
.states .states_l{
    flex:0 0 300px;
    line-height:40px;
    text-align:left;
    font-weight:bold;
}
.states .states_r{
     flex:1;
    text-align:right;
}
.content_title{
    height: 30px;
    line-height:30px;
    margin-top:10px;
    font-weight:bold;  
    border-bottom:1px solid #E4E7ED;
    margin-bottom:10px;
}
thead.has-gutter th{
    background:#eef6ff;
    padding:8px;
    font-size: 12px;
}
.el-table__body td{
    padding:5px 0;
    font-size:12px;
}
.shippingbtn_icon{
    font-size:18px;
    cursor: pointer;
}
/* 配送信息 */
.dispatching_box{
    border:1px solid #ebeef5;
    border-top:none;
    padding:10px;
}
.dispatching_box .item{
    height: 30px;
    line-height:30px;
    display: flex;
    color:#909399;
}
.dispatching_box .item .item_time{
    flex:0 0 180px;
    margin-left:50px;
}
.dispatching_box .item .item_cont{
    flex:1;  
}
.settlement{
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    display: inline-block;
    width: 100%;
}
.el-tag--mini{
    margin-right: 5px;
}

.bg .el-input__inner{
    background: #f4f4f5;
}
.name-wrapper .cell{
    white-space:nowrap;          /* 不换行 */
    overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
</style>




