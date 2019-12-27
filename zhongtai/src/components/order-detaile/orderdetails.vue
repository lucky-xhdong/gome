<template>
<div class="order_detailsbox">
    <div class="order_details_l"> 
        <el-collapse v-model="pageactiveNames" class="orderdetails_title" @change="handleChange">
            <el-collapse-item title="配送" name="1">   
                <div class="order_details_cont">
                    <!-- 配送单 -->
                    <el-collapse v-model="activeNames">
                            <el-collapse-item class="orderdetails_subtitle" v-for="(shippingItem,key, index) in response.shippingGroupList" :key="shippingItem.id" :name="key">
                                <template slot="title">
                                    <span class="shippingtype">配送单：{{shippingItem.shippingGroupId}}</span>
                                    <!-- 普通卡和临时卡，有权限 -->
                                    <div class="inline" v-if="LOGINDATA.orderplatform_orderDetaile_resendMesg">
                                        <span v-if="shippingItem.billShippingMethod == 2">提货码：</span>
                                        <span v-else-if="((shippingItem.billShippingMethod == 0) || (shippingItem.billShippingMethod == 3))">签收码：</span>
                                    </div>
                                    <div class="inline" v-else-if="(response.cardFlag ==0 && LOGINDATA.orderplatform_orderDetaile_viewCodingMember) || (response.cardFlag ==1 && LOGINDATA.orderplatform_orderDetaile_viewCoding)">
                                        <span v-if="shippingItem.shippingVerifyCode == 1 && shippingItem.billShippingMethod == 2">提货码：</span>
                                        <span v-else-if="shippingItem.shippingVerifyCode == 1 && ((shippingItem.billShippingMethod == 0) || (shippingItem.billShippingMethod == 3))">签收码：</span>
                                    </div>
                                    <!-- 普通卡 -->
                                    <div v-if="response.cardFlag ==0" class="inline">
                                        <div class="inline" v-if="shippingItem.shippingVerifyCode == 1 && LOGINDATA.orderplatform_orderDetaile_viewCodingMember">
                                            <span class="shippingtype" v-if="shippingItem.billShippingMethod == 2">{{shippingItem.codingtext}}<el-button v-if="!shippingItem.ischeck" type="primary" plain size="mini" @click.stop="viewCodingMember(shippingItem)">查看提货码</el-button></span>
                                            <span class="shippingtype" v-else-if="(shippingItem.billShippingMethod == 0) || (shippingItem.billShippingMethod == 3)">{{shippingItem.codingtext}}<el-button @click.stop="viewCodingMember(shippingItem)"  v-if="!shippingItem.ischeck" type="primary" plain size="mini" >查看签收码</el-button></span>
                                        </div>
                                    </div>
                                    <!-- 临时卡 -->
                                    <div v-if="response.cardFlag ==1" class="inline">
                                        <div class="inline" v-if="shippingItem.shippingVerifyCode == 1 && LOGINDATA.orderplatform_orderDetaile_viewCoding">
                                            <span class="shippingtype" v-if="shippingItem.billShippingMethod == 2">{{shippingItem.codingtext}}<el-button v-if="!shippingItem.ischeck" type="primary" plain size="mini" @click.stop="viewCoding(shippingItem)">查看提货码</el-button></span>
                                            <span class="shippingtype" v-else-if="(shippingItem.billShippingMethod == 0) || (shippingItem.billShippingMethod == 3)">{{shippingItem.codingtext}}<el-button @click.stop="viewCoding(shippingItem)"  v-if="!shippingItem.ischeck" type="primary" plain size="mini" >查看签收码</el-button></span>
                                        </div>
                                    </div> 
                                    <el-button v-if="LOGINDATA.orderplatform_orderDetaile_resendMesg" type="primary" plain size="mini" @click.stop="resendMesg(shippingItem)">重新发送</el-button>    
                                </template>
                                
                                <div class="content">
                                    <!-- v-if="shippingItem.state=='取消申请待审核'" -->
                                    <div class="states">
                                        <div class="states_l">
                                            <div v-if="shippingItem.state=='已出库' && (shippingItem.auditState=='拒收申请待审核' || shippingItem.auditState=='拒收申请审核通过')" class="letterspace">{{shippingItem.auditState}}</div>
                                            <div v-else-if="shippingItem.state=='已拒收' && (shippingItem.auditState=='拒收待入库' || shippingItem.auditState=='商品已返回大库' || shippingItem.auditState=='拒收申请待审核')" class="letterspace">{{shippingItem.auditState}}</div>
                                            <div v-else>{{shippingItem.state}}</div>

                                            <div v-if="shippingItem.state=='取消申请待审核'" role="tooltip" id="el-tooltip-8106" aria-hidden="false" class="el-tooltip__popper is-light orderstatusTip" x-placement="right-end">该订单正在取消待处理阶段，请及时联系服务台进行审核处理！<div x-arrow="" class="popper__arrow" style="top: 8px;"></div></div>
                                            <div v-if="shippingItem.state=='已出库' && shippingItem.auditState=='拒收申请待审核'" role="tooltip" id="el-tooltip-8106" aria-hidden="false" class="el-tooltip__popper is-light orderstatusTip1" x-placement="right-end">该订单促销已发放，需服务台审核处理后才可退款。<div x-arrow="" class="popper__arrow" style="top: 8px;"></div></div> 
                                            <div v-else-if="shippingItem.state=='已拒收' && shippingItem.auditState=='拒收待入库'" role="tooltip" id="el-tooltip-8106" aria-hidden="false" class="el-tooltip__popper is-light orderstatusTip2" x-placement="right-end">拒收商品返回仓库后才可为您处理退款。<div x-arrow="" class="popper__arrow" style="top: 8px;"></div></div>
                                            <div v-else-if="shippingItem.state=='已拒收' && shippingItem.auditState=='拒收申请待审核'" role="tooltip" id="el-tooltip-8106" aria-hidden="false" class="el-tooltip__popper is-light orderstatusTip1" x-placement="right-end">该订单促销已发放，需服务台审核处理后才可退款。<div x-arrow="" class="popper__arrow" style="top: 8px;"></div></div>
                                        </div>
                                        <div class="states_r" v-if="shippingItem.canCancel ==1 && LOGINDATA.orderplatform_orderDetaile_cancel">
                                            <el-button type="primary" v-if="shippingItem.shippingPromotion ==1" @click="shippingItem.dialogVisible = true" size="mini" >退货（取消配送单）</el-button>
                                            <el-button type="primary" v-if="shippingItem.shippingPromotion ==0" @click="shippingItem.dialogVisible = true" size="mini">退货（取消配送单）</el-button>
                                            <!-- 取消订单弹层 -->
                                            <el-dialog
                                                title="取消订单并退货确认"
                                                :visible.sync="shippingItem.dialogVisible"
                                                width="30%">
                                                <span>订单已经付款，确认取消订单吗？订单取消成功后将发起退款。</span>
                                                <span slot="footer" class="dialog-footer">
                                                    <el-button @click="shippingItem.dialogVisible = false">取 消</el-button>
                                                    <el-button type="primary" @click="cancelOrder(shippingItem,shippingItem.shippingPromotion)" v-if="LOGINDATA.orderplatform_orderDetaile_cancelSure">确 定</el-button>
                                                </span>
                                            </el-dialog> 
                                        </div>
                                        <div class="states_r" v-if="shippingItem.canReject ==1 && LOGINDATA.orderplatform_orderDetaile_rejection">
                                            <el-button v-if="shippingItem.canReject ==1 && LOGINDATA.orderplatform_orderDetaile_rejection" type="primary" @click="rejectionOrder(shippingItem,1)" size="mini">拒收</el-button>
                                        </div>
                                        <div class="states_r" v-if="shippingItem.canConfirm ==1 && LOGINDATA.orderplatform_orderDetaile_rejectionOrder">
                                            <el-button type="primary"  v-if="shippingItem.canConfirm ==1 && LOGINDATA.orderplatform_orderDetaile_rejectionOrder"  @click="rejectionOrder(shippingItem,2)" size="mini">确认收货</el-button>
                                        </div>
                                        <div class="states_r" v-if="!(shippingItem.canConfirm ==1 && LOGINDATA.orderplatform_orderDetaile_rejectionOrder) && !(shippingItem.canReject ==1 && LOGINDATA.orderplatform_orderDetaile_rejection) && !(shippingItem.canCancel ==1 && LOGINDATA.orderplatform_orderDetaile_cancel)">
                                            <div v-if="(shippingItem.state=='待出库')||(shippingItem.state=='已出库')">
                                            <el-tooltip placement="bottom" effect="custom">
                                                <div slot="content" class="line24 ordertipcont">
                                                    <p>物流派工后就不支持取消配送单了，如用户想退货，有以下两种情况操作：</p>
                                                    <p>1、物流派工后~商品出库前，如用户想退货，可做如下处理：</p>
                                                    <p class="indent20">a、联系物流取消派工后，刷新页面，会展示《退货（取消配送单）》按钮，点击后即可退货退款；</p>
                                                    <p class="indent20">b、联系物流操作出库后，做拒收处理，即可退货退款</p>
                                                    <p>2、商品出库后，如用户想退货，可做如下处理：</p>
                                                    <p class="indent20">a、出库后~妥投前，可联系物流做拒收处理；</p>
                                                    <p class="indent20">b、如已送至用户家，可让用户拒收货，或者让用户收货后在申请退货；</p>
                                                    <p class="giftlink"><a :href="pagelink" title="" target="_blank">了解更多退货操作&gt;&gt;</a></p>
                                                    
                                                </div>
                                                <el-button class="orderTipbtn">当前状态下，如何退货？</el-button>
                                            </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 收货人表格 -->
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"  v-if="shippingItem.consigneeName || shippingItem.consigneePhone || shippingItem.consigneeAddress">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th width="20%" class="is-center">
                                                        <div class="cell">收货人姓名</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">收货人电话</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">收货地址</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body">
                                                <tr class="el-table__row">
                                                    <td class="el-table_2_column_10 is-center ">
                                                        <div class="cell">{{shippingItem.consigneeName}}</div>
                                                    </td>
                                                    <td class="el-table_2_column_11 is-center ">
                                                        <div class="cell" v-if="LOGINDATA.orderplatform_orderDetaile_seeTel">{{shippingItem.consigneePhone}}<el-button @click="lookTelNum(shippingItem)" v-if="!shippingItem.showbtn" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                                        </div>
                                                    </td>
                                                    <td class="el-table_2_column_12 is-center ">
                                                        <div class="cell">{{shippingItem.consigneeAddress}}</div>                                           
                                                    </td>
                                                </tr>
                                                <tr v-if="!shippingItem.consigneeName && !shippingItem.consigneePhone && !shippingItem.consigneeAddress">
                                                    <td colspan="3" class="is-center ">
                                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 商品信息 -->
                                    <div class="content_title">商品信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
                                            <thead class="has-gutter">
                                                <tr class="el-table__row">
                                                    <th width="5%"></th>
                                                    <th class="is-center" width="15%">
                                                        <div class="cell">商品名称</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">商品编码</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">价格</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">数量</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">品牌</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">业务机型</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">导购员编号</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">导购员姓名</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">配送方式</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell" style="width:70px;">配送时间</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">安装方式</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell" style="width:70px;">安装时间</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell" style="width:70px;">操作</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.commerceItemList" :key="prdItem.id">
                                                <tr class="el-table__row">
                                                    <td class="is-center ">
                                                        <i v-if='prdItem.salesPromotionList.length !=0' class="shippingbtn_icon" @click="prdItem.show=!prdItem.show" v-bind:class="prdItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell ellipsis" :title="prdItem.displayName">
                                                            <div>
                                                            <el-tag type="danger" v-if="prdItem.type ==2" size="mini">赠品</el-tag>
                                                            <el-tag type="info" v-if="prdItem.isBarterGoods ==1" size="mini">换购</el-tag>
                                                            <el-tag  v-if="prdItem.packageTab ==1" size="mini">套装</el-tag>
                                                            <el-tag v-if="prdItem.preSellTab ==1" type="success" size="mini">预售</el-tag>
                                                            {{prdItem.displayName}}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.skuNo}}</div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell" v-if="prdItem.isBarterGoods ==1">
                                                            <div>售价：{{prdItem.salePrice}}</div>
                                                            <div>换购价：{{prdItem.promPrice}}</div>
                                                        </div>
                                                        <div class="cell" v-else>
                                                            {{prdItem.salePrice}}
                                                        </div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.quantity}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.brandName}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.salesModel}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.guiderCode}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.guiderName}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.shippingMethod}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.appointmentDeliveryDate}}</div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.installMethod}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.appointmentInstallDate}}</div> 
                                                    </td>
                                                    <td class="is-center " width="150">   
                                                        <router-link  :to="{path:'/order/applyService',query:{orderId:orderId,shipId:shippingItem.shippingGroupId,commerceItemId:prdItem.commerceItemId,detailId:prdItem.detailId}}">
                                                            <span v-if="prdItem.canReturn==1"><el-button v-if="LOGINDATA.orderplatform_orderDetaile_exchange" type="text" size="small">申请退换货</el-button></span>
                                                        </router-link>
                                                        <!-- <div><el-button @click="applyRefundDialog = true" size="small" type="text">申请退换货<i class="el-icon-question"></i></el-button></div> -->
                                                        <div  v-if="shippingItem.canConfirm ==1 && LOGINDATA.orderplatform_orderDetaile_returnRemind">
                                                            <el-popover
                                                                placement="top"
                                                                width="400"
                                                                trigger="hover"
                                                                content="因商品选择的是厂商自提配送，所以需服务台确认收货/用户在国美三端点击确认后货后才可以申请退换货。">
                                                                <span slot="reference" class="cursor">退换货提醒<i class="el-icon-question"></i></span>
                                                            </el-popover>
                                                        </div>  
                                                        <el-button  @click.stop="buyInsurance(prdItem,shippingItem)" v-if="LOGINDATA.orderplatform_orderDetaile_buyInsurance && prdItem.canBuyYanbao==1" size="small" type="text">购买延保</el-button>
                                                        <div><el-button size="small" v-if="LOGINDATA.orderplatform_orderDetaile_sendInsurance && prdItem.canSendWarrantyAgreement==1" type="text" @click="sendinsurance(shippingItem,prdItem)">发送协议</el-button></div>
                                                         <div><el-button size="small" v-if="LOGINDATA.orderplatform_orderDetaile_printInsurance && prdItem.canPrintWarrantyAgreement==1" type="text" @click="jumpto('/order/insuranceContract',{'shippingGroupId':shippingItem.shippingGroupId,'commerceItemId':prdItem.commerceItemId})">打印协议</el-button></div>
                                                    </td>
                                                </tr>
                                                <tr class="el-table__row" style="background:#EBEEF5;"  v-if='prdItem.show && prdItem.salesPromotionList.length !=0'>
                                                    <td colspan="15">
                                                        <div class="ml40">
                                                            <div class="paymentmesg" v-for="(item,index) in (prdItem.salesPromotionList)" :key="item.id" v-if="index<2"><span class="mr20">{{item.promotionName}}：{{item.promotionDesc}}</span></div>                            
                                                            <div class="gifttipsmesg">赠美豆在订单收款后发放至顾客的会员账户</div>
                                                            <div class="gifttipsmesg" v-for="(item,index) in (prdItem.salesPromotionList)" :key="item.id" v-if="item.giftCouponItemNum>1">{{item.giftCouponItemNum}}件商品共同享受此促销</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody class="el-table__body" v-if="shippingItem.commerceItemList.length ==0">
                                                <tr>
                                                    <td colspan="15" class="is-center ">
                                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                                    </td>
                                                </tr> 
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 发票信息 -->
                                    <div class="content_title" v-if="shippingItem.invoiceInfoList.length && response.storeFlag==0">发票信息</div>
                                    <div v-if="response.storeFlag==0" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="el-table__row">
                                                    <th width="5%"></th>
                                                    <th class="is-center" width="20%">
                                                        <div class="cell">发票类型</div>
                                                    </th>
                                                    <th class="is-center" width="10%">
                                                        <div class="cell">发票状态</div>
                                                    </th>
                                                    <th class="is-center" width="15%">
                                                        <div class="cell">发票号码</div>
                                                    </th>
                                                    <th class="is-center" width="10%">
                                                        <div class="cell">单位名称</div>
                                                    </th>
                                                    <th class="is-center" width="10%">
                                                        <div class="cell">购方税号</div>
                                                    </th>
                                                    <th class="is-center" width="15%">
                                                        <div class="cell">发票内容</div>
                                                    </th>
                                                    <th class="is-center" width="15%">
                                                        <div class="cell">是否收回</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body" v-for="(invoiceItem,index) in shippingItem.invoiceInfoList" :key="invoiceItem.id">
                                                <tr class="el-table__row">
                                                    <td class="is-center ">
                                                        <i class="shippingbtn_icon" v-if="invoiceItem.invoiceType==1" @click="invoiceItem.show=!invoiceItem.show" v-bind:class="invoiceItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceType | formatInvoiceType}}</div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceState}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceNum}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceHead}}</div>    
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.taxpayerNo}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceContent}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{invoiceItem.invoiceBack | formatinvoiceBack}}</div>                 
                                                    </td>
                                                </tr>
                                                <tr class="el-table__row" style="background:#EBEEF5;" v-if="invoiceItem.show">
                                                    <td colspan="8">
                                                        <div class="ml40">
                                                            <div class="paymentmesg1" v-if="invoiceItem.vatAuditState">
                                                                <span class="title">增票状态：</span>{{invoiceItem.vatAuditState | formatvatAuditState}}
                                                                <span class="red ml20" v-if="invoiceItem.vatAuditState==1">发票生成后，财务人员会联系用户去门店取发票</span>
                                                                <span class="red ml20" v-else-if="invoiceItem.vatAuditState==2">审核通过后，才能开票，发票生成后，财务人员会联系用户去门店取发票</span>
                                                                <span class="red ml20" v-else-if="invoiceItem.vatAuditState==3 || invoiceItem.vatAuditState==4 || invoiceItem.vatAuditState==5">可提醒用户去服务台重新申请资质，审核通过后即可开票</span>
                                                            </div>
                                                            <div class="paymentmesg1 mt10" v-if="invoiceItem.invoiceHead"><span class="title">单位名称：</span>{{invoiceItem.invoiceHead}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.taxpayerNo"><span class="title">纳税人识别号：</span>{{invoiceItem.taxpayerNo}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.registeredAddr"><span class="title">注册地址：</span>{{invoiceItem.registeredAddr}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.registeredPhone"><span class="title">注册电话：</span>{{invoiceItem.registeredPhone}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.taxpayerBank"><span class="title">开户银行：</span>{{invoiceItem.taxpayerBank}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.taxpayerAccount"><span class="title">银行账户：</span>{{invoiceItem.taxpayerAccount}}</div>
                                                            <div class="paymentmesg1 mt10" v-if="invoiceItem.shippingAddress"><span class="title">发票邮寄地址：</span>{{invoiceItem.shippingAddress}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.shippingName"><span class="title">收票人：</span>{{invoiceItem.shippingName}}</div>
                                                            <div class="paymentmesg1" v-if="invoiceItem.shippingPhone"><span class="title">电话号码：</span>{{invoiceItem.shippingPhone}}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody class="el-table__body" v-if="shippingItem.commerceItemList.length ==0">
                                                <tr>
                                                    <td colspan="15" class="is-center ">
                                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                                    </td>
                                                </tr> 
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 配送信息 -->
                                    <div class="content_title">配送信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small ">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th width="50" class="is-center"></th>
                                                    <th class="is-center">
                                                        <div class="cell">配送(货运)单号</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">配送单状态</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">发货公司代码</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">物流单号</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">承运商</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">承运商电话</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">送货人姓名</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">送货人电话</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body">
                                                <tr class="el-table__row">
                                                    <td class="el-table_2_column_10 is-center ">
                                                        <i class="shippingbtn_icon" v-bind:class="shippingItem.shippingisopen ? 'el-icon-remove-outline':'el-icon-circle-plus-outline'" @click="ShippingResume(shippingItem)"></i>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.shippingGroupId}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.state}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryCompanyCode}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.trackingNumber}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryCompanyName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryCompanyPhone}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryStaffName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryStaffPhone}}</div>                                           
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="dispatching_box" v-if="shippingItem.shippingisopen" style="background:#EBEEF5;">
                                        <ul>
                                            <li class="item" v-for="ShippingResumeItem in shippingItem.shippingResumeList" :key="ShippingResumeItem.id">
                                                <span class="item_time">{{ShippingResumeItem.stateDate | formatDate}}</span><span class="item_cont">{{ShippingResumeItem.description}}</span>
                                            </li>
                                        </ul>
                                        <div v-if="!shippingItem.shippingResumeList">暂无信息</div>
                                    </div>
                                    <!-- 安装信息 -->
                                    <div class="content_title" v-if="shippingItem.shippingInstallList.length != 0">安装信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" v-if="shippingItem.shippingInstallList.length != 0">
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th width="50"></th>
                                                    <th  class="is-center">
                                                        <div class="cell" width="120">商品名称</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">处理时间</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装状态</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装单号</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装网点名称</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装员姓名</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装员电话</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">是否作废</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.shippingInstallList" :key="prdItem.id">
                                                <tr class="el-table__row">
                                                    <td class="is-center">
                                                        <i class="shippingbtn_icon" @click="InstallResume(prdItem,shippingItem)" v-bind:class="prdItem.installisopen ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell ellipsis" :title="prdItem.skuName"><div>{{prdItem.skuName}}</div></div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.appointmentDate | formatDate}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.state}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installNum}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installSiteName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installStaffName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installStaffTelephone}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div v-if="prdItem.invalidFlag == 0">否</div>
                                                        <div v-else-if="prdItem.invalidFlag == 1">是</div>
                                                    </td>
                                                </tr>
                                                <tr class="el-table__row" style="background:#EBEEF5;" v-if="prdItem.installisopen">
                                                    <td colspan="9">
                                                        <!-- 安装信息履历 -->
                                                        <div class="dispatching_box">
                                                            <ul>
                                                                <li class="item" v-for="installItem in prdItem.installResumeList" :key="installItem.id">
                                                                    <span class="item_time">{{installItem.stateDate | formatDate}}</span><span class="item_cont">{{installItem.description}}</span>
                                                                </li>
                                                            </ul>
                                                            <div v-if="!prdItem.installResumeList">暂无信息</div>
                                                        </div>
                                                        
                                                    </td>
                                                </tr>                                                
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 退款信息 -->
                                    <div class="content_title" v-if="shippingItem.refundInfoList != null && shippingItem.refundInfoList.length != 0 && shippingItem.refundFlag==1">退款信息</div>
                                    <div class="ordercont_box" v-if="shippingItem.refundInfoList != null && shippingItem.refundInfoList.length != 0 && shippingItem.refundFlag==1">
                                        <el-table :data="shippingItem.refundInfoList" border :show-header="true" size="small ">
                                            <el-table-column prop="refundId" label="退款单号" align="center"></el-table-column>
                                            <el-table-column prop="refundReason" label="退款原因" align="center"></el-table-column>
                                            <el-table-column prop="refundMethod" label="退款方式" align="center"></el-table-column>
                                            <el-table-column prop="payMethod" label="支付方式" align="center"></el-table-column>
                                            <el-table-column prop="refundAmount" label="退款金额" align="center"></el-table-column>
                                            <el-table-column prop="refundState" label="退款状态" align="center"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-collapse-item>
                    </el-collapse>
                </div>
            </el-collapse-item>
            <el-collapse-item title="订单履历" name="2">
                <!-- 订单履历 -->
                <div class="ordercont_box" v-if="response.orderHistoryList.length">
                    <ul>
                        <li class="item" v-for="item in response.orderHistoryList" :key="item.id">
                            <span class="item_time">{{item.stateDate | formatDate}}</span><span class="item_cont">{{item.description}}</span>
                        </li>
                    </ul>
                    <div class="ordercont_box" v-if="!response.orderHistoryList">暂无信息</div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="支付信息" name="3" v-if="response.paymentGroupInfoList">
                <!-- 支付信息 -->
                <div class="ordercont_box" v-for="(paymentItem,index) in response.paymentGroupInfoList" :key="paymentItem.id">
                    <div class="paymentmesg"><span class="mr20">支付单号：{{paymentItem.paymentGroupId}}</span><span>支付类型：{{paymentItem.paymentType}}</span></div>
                    <el-table :data="paymentItem.paymentGroupList" border :show-header="true" size="small ">
                        <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>
                        <el-table-column prop="transId" label="交易流水号" align="center"></el-table-column>
                        <el-table-column prop="cashierPayNo" label="收银台支付号" align="center"></el-table-column>
                        <el-table-column prop="payEntityId" label="合并支付号" align="center"></el-table-column>
                        <el-table-column prop="paymentsType" label="付款类型" align="center"></el-table-column>
                        <el-table-column prop="payAmount" label="交易金额" align="center"></el-table-column>
                        <el-table-column prop="transTimestamp" label="交易时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.transTimestamp | formatDate}}
                            </template>
                        </el-table-column>
                        <el-table-column label="交易处理时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.transDealTimestamp | formatDate}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="ordercont_box" v-if="response.paymentGroupInfoList.length==0">暂无信息</div>
            </el-collapse-item>
            <el-collapse-item title="退货信息" name="4">
                <!-- 退货信息 -->
                <div class="ordercont_box" v-if="response.returnRequestList">
                    <el-table :data="response.returnRequestList" border :show-header="true" size="small ">
                        <el-table-column prop="returnRequestId" label="退换货单号" align="center">
                            <template slot-scope="scope"><el-button  @click="jumpto('/order/serviceList_detail',{'returnRequestId':scope.row.returnRequestId})" type="text" size="small">{{scope.row.returnRequestId}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdDate" label="提交时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.createdDate | formatDate}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="退换货状态" align="center"></el-table-column>
                        <el-table-column prop="refundId" label="退款单号" align="center"></el-table-column>
                        <el-table-column prop="refundState" label="退款单状态" align="center"></el-table-column>
                    </el-table>
                </div>
                <div class="ordercont_box" v-if="!response.returnRequestList">暂无信息</div>
            </el-collapse-item>
        </el-collapse>
    </div>
    <div class="order_details_r">
        <g-header v-model="righttitle"></g-header>
        <div class="orderinfo" v-if="response.orderId || response.createdByOrder || response.submittedDate ||response.state">
            <div class="item" v-if="response.orderId">
                <span class="label">订单编号： </span> 
                <div class="info-rcol">{{response.orderId}}</div> 
            </div>
            <div class="item" v-if="response.createdByOrder">
                <span class="label">原始订单编号：</span> 
                <div class="info-rcol">{{response.createdByOrder}}</div> 
            </div>
            <div class="item" v-if="response.submittedDate">
                <span class="label"> 下单时间：</span> 
                <div class="info-rcol">{{response.submittedDate | formatDate}}</div> 
            </div>
            <div class="item" v-if="response.state">
                <span class="label"> 订单状态：</span> 
                <div class="info-rcol">{{response.state}}</div> 
            </div>
        </div>
        <div class="orderinfo" v-if="response.memberCardId || response.memberPhone">
            <div class="item" v-if="response.memberCardId">
                <span class="label">会员卡号： </span> 
                <div class="info-rcol">{{response.memberCardId}}</div>
            </div>
            <div class="item" v-if="response.memberPhone">
                <span class="label">会员电话：</span> 
                <div class="info-rcol">{{response.memberPhone}}<el-button v-if="!response.showbtn && LOGINDATA.orderplatform_orderDetaile_seeMemberTel" @click="checkmemberPhone" type="primary" size="mini" class="ml10">查看</el-button></div>
            </div>
        </div>
        <div class="orderinfo" v-if="response.payMethod || response.payType || response.siteId">            
            <div class="item" v-if="response.payType">
                <span class="label">支付类型：</span> 
                <div class="info-rcol">{{response.payType}}</div> 
            </div>
            <div class="item" v-if="response.payMethod">
                <span class="label">支付方式： </span> 
                <div class="info-rcol">{{response.payMethod}}</div> 
            </div>
            <div class="item" v-if="response.siteId">
                <span class="label">订单站点：</span> 
                <div class="info-rcol">{{response.siteId}}</div> 
            </div>
        </div>
        <div class="payinfor">
            <div class="item mb10" v-if="response.orderAmount">
                <span class="label">商品总价：</span> 
                <div class="info-rcol">¥{{response.orderAmount}}</div> 
            </div>
            <div class="item mb10" v-if="response.discountAmount">
                <span class="label">折扣优惠：</span> 
                <div class="info-rcol">- ¥{{response.discountAmount}}</div> 
            </div>
            <div class="item" v-if="response.gomeCouponAmount">
                <span class="label">使用美券：</span> 
                <div class="info-rcol">- ¥{{response.gomeCouponAmount}}</div> 
            </div>
            <div class="item mb10" v-if="response.gomeBeansAmount">
                <span class="label">美豆金额：</span> 
                <div class="info-rcol">- ¥{{response.gomeBeansAmount}}</div> 
            </div>
            <div v-if="response.depositExpandAmount">
                <div class="item" v-if="response.depositAmount">
                    <span class="label">定金金额：</span> 
                    <div class="info-rcol">¥{{response.depositAmount}}(抵扣 ¥{{response.depositExpandAmount}})</div> 
                </div>
                <div class="item mb10" v-if="response.balanceAmount">
                    <span class="label">尾款金额：</span> 
                    <div class="info-rcol">¥{{response.balanceAmount}}</div> 
                </div>
            </div>
            <div v-else>
                <div class="item mb10" v-if="response.depositAmount">
                    <span class="label">定金金额：</span> 
                    <div class="info-rcol">¥{{response.depositAmount}}</div> 
                </div>
                <div class="item mb10" v-if="response.balanceAmount">
                    <span class="label">尾款金额：</span> 
                    <div class="info-rcol">¥{{response.balanceAmount}}</div> 
                </div>
            </div>             
            <div class="item mt10" v-if="response.giftItemShareAmount">
                <span class="label">赠品分摊：</span> 
                <div class="info-rcol">- ¥{{response.giftItemShareAmount}} 
                    <el-popover placement="right" width="640" trigger="hover" v-if="response.giftItemShareAmount && response.giftItemShares" :show-close="true">
                        <div class="el-dialog__header giftbox_title">
                            <span class="el-dialog__title">赠品促销分摊明细</span>
                        </div>
                        <div class="giftbox_cont">
                            <p class="giftbox_mesg">本单分摊赠品总额共：<span class="red">- ¥{{response.giftItemShareAmount}}</span></p>
                            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">                          
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%" height="100%">
                                    <thead class="has-gutter">
                                        <tr class="">
                                            <th width="190" class="is-center">
                                                <div class="cell">主商品</div>
                                            </th>
                                            <th width="150" class="is-center">
                                                <div class="cell">赠品名称</div>
                                            </th>
                                            <th width="150" class="is-center">
                                                <div class="cell">赠品价值</div>
                                            </th>
                                             <th class="is-center">
                                                <div class="cell">本单分摊总额</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="el-table__body">
                                        <tr class="el-table__row" v-for="giftTable in response.giftItemShares" :key="giftTable.index">
                                            <td class="is-center" width="190">
                                                <div class="ellipsis" :title="giftTable.displayName">
                                                    <div class="pdtop5">
                                                        <el-tag type="danger" v-if="giftTable.itemType ==2" size="mini">赠品</el-tag> 
                                                        {{giftTable.displayName}}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="is-center bordernone" colspan="3">
                                                <table width="100%" cellspacing="0" cellpadding="0" >
                                                    <tr v-for="giftDetails in giftTable.giftItemShareDetails" :key="giftDetails.id">
                                                        <td width="149" class="pad8"><div class="ellipsis">{{giftDetails.displayName}}</div></td>
                                                        <td width="150" class="pad8">¥{{giftDetails.salePrice}}</td>
                                                        <td class="pad8 borderright"><span class="red">- ¥{{giftDetails.shareAmount}}</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="giftlink"><router-link :to="{path: '//mpf' + cookieDomain + '/service/helpCenter/commonProblem'}" target="_blank">赠品分摊细则&gt;</router-link></p>
                        </div>
                        <i slot="reference" class="el-icon-question"></i>
                    </el-popover>
                </div> 
            </div>
            <div class="item mt10" v-if="response.promItemShareAmount">
                <span class="label">加价换购分摊：</span> 
                <div class="info-rcol">- ¥{{response.promItemShareAmount}} 
                    <el-popover placement="right" width="640" trigger="hover" v-if="response.promItemShareAmount && response.promItemShares" :show-close="true">
                        <div class="el-dialog__header giftbox_title">
                            <span class="el-dialog__title">加价换购分摊金额明细</span>
                        </div>
                        <div class="giftbox_cont">
                            <p class="giftbox_mesg">本单加价换购促销分摊金额：<span class="red">- ¥{{response.promItemShareAmount}}</span></p>
                            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">                          
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%" height="100%">
                                    <thead class="has-gutter">
                                        <tr class="">
                                            <th width="150" class="is-center">
                                                <div class="cell">主商品</div>
                                            </th>
                                            <th width="150" class="is-center">
                                                <div class="cell">换购商品名称</div>
                                            </th>
                                            <th width="50" class="is-center">
                                                <div class="cell">数量</div>
                                            </th>
                                            <th width="100" class="is-center">
                                                <div class="cell">价格</div>
                                            </th>
                                            <th width="90" class="is-center">
                                                <div class="cell">换购优惠（需分摊）</div>
                                            </th>
                                            <th class="is-center">
                                                <div class="cell">本商品分摊金额</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="el-table__body">
                                        <tr class="el-table__row" v-for="giftTable in response.promItemShares" :key="giftTable.index">
                                            <td class="is-center" width="100">
                                                <div class="ellipsis" :title="giftTable.displayName">
                                                    <div class="pdtop5">
                                                        <el-tag type="danger" v-if="giftTable.itemType ==4" size="mini">换购</el-tag> 
                                                        {{giftTable.displayName}}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="is-center bordernone" colspan="5">
                                                <table width="100%" cellspacing="0" cellpadding="0" >
                                                    <tr v-for="giftDetails in giftTable.giftItemShareDetails" :key="giftDetails.id">
                                                        <td width="149" class="pad8"><div class="ellipsis">{{giftDetails.displayName}}</div></td>
                                                        <td width="50" class="pad8">¥{{giftDetails.quantity}}</td>
                                                        <td width="100" class="pad8">
                                                            <div>售价：¥{{giftDetails.salePrice}}</div>
                                                            <div>换购价：¥{{giftDetails.promPrice}}</div>
                                                        </td>
                                                        <td width="90" class="pad8">¥{{giftDetails.promDiscountPrice}}</td>
                                                        <td class="pad8 borderright"><span class="red">- ¥{{giftDetails.shareAmount}}</span></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p class="giftlink"><router-link :to="{path: '//mpf' + cookieDomain + '/service/helpCenter/commonProblem'}" target="_blank">赠品分摊细则&gt;</router-link></p>
                        </div>
                        <i slot="reference" class="el-icon-question"></i>
                    </el-popover>
                </div> 
            </div>
            <div class="item mt10" v-for="(item, index) in response.paymentGroupList" :key="item.id">
                <span class="label">{{item.paymentMethodName}}：</span> 
                <div class="info-rcol">¥{{item.payAmount}}</div> 
            </div>  
            <div class="item mt10">
                <span class="label">实收金额总计：</span> 
                <div class="info-rcol">¥{{response.orderPaidAmount}}</div> 
            </div>
        </div>
    </div>
    <!-- 延保 -->
    <ExtendedWarranty @getdialogvisible="getdialogvisible" :pGoodsData="buyInsuranceData" v-if="insuranceDialogVisible"></ExtendedWarranty>
    <!-- 重新发送 -->
    <el-dialog title="重新发送短信" :lock-scroll="false" :visible.sync="dialogResend" width="450px" align="left" @close="dialogResendClose" ref="main">
        <el-form :model="MessageForm" :rules="rules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="接收手机号：" left prop="tel">
                        <el-input  v-model.trim="MessageForm.tel" style="width:200px;" placeholder="请输入接收人手机号" @keyup.enter.native="sendMesgEvent" ref="MessageInput"></el-input>
                        <el-button v-if="MessageForm.tel=='' || istelerroe" disabled type="primary" size="mini" >发 送</el-button>
                        <el-button v-else type="primary" @click="sendMesgEvent"  size="mini" >发 送</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
    <!-- 发送协议 -->
    <el-dialog title="发送延保协议" :lock-scroll="false" :visible.sync="dialogFormVisible" width="450px" align="left" @submit.native.prevent>
        <el-form :model="delateForm" :rules="rules" label-width="100px" size="mini">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="收票人邮箱：" left prop="email">
                        <el-input @keyup.enter.native="sendFormEvent" ref="insuranceInput"  v-model.trim="delateForm.email" style="width:200px;" placeholder="请输入收票人邮箱" ></el-input>
                        
                        <el-button v-if="delateForm.email=='' || isemailerroe" type="primary" disabled @click="sendFormEvent" size="mini" >发 送</el-button>
                        <el-button v-else type="primary" @click="sendFormEvent"  size="mini" >发 送</el-button>

                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
    <!-- 拒收弹层 -->
    <el-dialog
        title="确认拒收"
        :visible.sync="rejectionDialog"
        :lock-scroll="false"
        width="30%">
        <span>请与厂家及顾客确认后，才能点击确认拒收！</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rejectionDialog = false">取 消</el-button>
            <el-button type="primary" @click="rejectionOrderquery" v-if="LOGINDATA.orderplatform_orderDetaile_rejection">确认拒收</el-button>
        </span>
    </el-dialog> 
    <!--确认收货弹层 -->
    <el-dialog
        title="确认收货"
        :visible.sync="receiptDialog"
        :lock-scroll="false"
        width="30%">
        <span>需用户确认已经收到货后，才能点击确认收货！</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="receiptDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmReceipt">确认收货</el-button>
        </span>
    </el-dialog> 
    <!--导购员权限的申请退换货弹层 -->
    <!-- <el-dialog
        title="暂不可申请退换货"
        :visible.sync="applyRefundDialog"
        :lock-scroll="false"
        width="30%">
        <span>因商品选择的是厂商自提配送，所以需服务台确认收货/用户在国美三端点击确认后货后才可以申请退换货。</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="applyRefundDialog = false">确定</el-button>
        </span>
    </el-dialog>  -->
</div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import API from "@/api/orderDetail/orderdetails";
import { formatDate } from "@/common/time";
import ExtendedWarranty from '@/components/order-detaile/extendedWarranty';
import Env from '@/api/env';
export default {
    data() {
        //邮箱校验
        var validateEmall = (rule, value, callback) => {
            var notEmail = !/^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/.test(
                value
            );
            if (value != "") {
                if (notEmail) {
                    callback(new Error("请输入正确的邮箱"));
                    this.isemailerroe =true;
                } else {
                    callback();
                    this.isemailerroe =false;
                }
            }
        };
        //手机号校验
        var validatePhoneNofn = (rule, value, callback) => {
        if (value == "") {
            //callback(new Error("请输入正确的11位手机号码"));
        } else if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value)) {
            callback(new Error("请输入正确的11位手机号码"));
            this.istelerroe = true;
        } else {
            callback();
            this.istelerroe = false;
        }
        };
        var validateNumber = (rule, value, callback) => {
        var orderRegex = /^[0-9]+$/;
            if (value == "") {
                //callback(new Error("请输入正确的11位手机号码"));
            }else if(!orderRegex.test(value)) {
                callback(new Error("填写信息错误，请输入数字"));
                this.istelerroe = true;
            }else {
                callback();
                this.istelerroe = false;
            }
        };
        return {
            tooltipShow:true,
            ishow: true,
            orderId: this.$route.query.orderId,
            storeCode: this.$route.query.storeCode,
            shippingGroupId:this.$route.query.shippingGroupId,
            dispatchingmesg: true,
            dialogVisible: false, //取消配送单弹层变量
            i: -1, //商品列表收起展开变量
            queryorder: false, //是否刷新履历
            returninfo: false, //退货信息是否刷新
            lefttitle: {
                showclose: "", //右面的关闭
                content: "配送"
            },
            righttitle: {
                showclose: "", //右面的关闭
                content: "订单信息"
            },
            activeNames: [0], //配送默认展开控制
            pageactiveNames: ["1"], //页面左侧第一个展开
            response: {
            //页面信息
            paymentGroupInfo: {},
            orderHistoryList: []
            },
            delateForm: {
                //发送延保邮箱form
                email: ""
            },
            MessageForm: {
                //重新发送短信form
                tel: ""
            },
            istelerroe: false, //手机号是否错误
            rules: {
                //校验规则
                email: [
                    //邮箱
                    { validator: validateEmall, trigger: "blur" }
                ],
                tel: [
                    //手机号
                    { validator: validatePhoneNofn, trigger: "blur" },
                    { validator: validateNumber, trigger: "change" }
                ]
            },
            insuranceData:{},//查询购买延保数据
            insuranceDialogVisible:false,//补够延保弹层是否展示
            prarentinsuranceDialogVisible:false,//补够延保弹层是否展示
            buyInsuranceData:{},//查询购买延保数据
            addIncrement:{},//购买延保需要提交的数据
            dialogResend:false,//重新发送短信弹层
            myshippingGroupId:'',//配送单号
            dialogFormVisible:false,//发送协议弹层
            sendinsuranceData:{},//发送延保协议存储数据用
            isemailerroe: false, //邮箱是否错误
            cookieDomain:'',//环境变量
            rejectionDialog:false,//拒收弹层
            rejectionMesg:{//配送单号
                shippingGroupId:''
            },
            receiptDialog:false,//确认收货弹层
            applyRefundDialog:false,//导购员权限的申请退还货弹层提示
            vatAuditState:'',//增票提醒
        };
    },
    methods: {
        getPageData() {
        //获取页面数据
        var _this = this;
        if (this.orderId || this.storeCode) {
            _this.manageInit();
        } else {
            // _this.isErrorTxt = true
        }
        },
        manageInit() {
        //获取页面数据的请求
        var _this = this;
        var parms={
            orderId: this.orderId,
            storeCode: this.storeCode
        };
        if(this.LOGINDATA.storeStaffId != null){//导购员
            parms.sellerId=this.LOGINDATA.storeStaffId
        }
        API.orderdetails(parms).then(function(data) {
            if (data.success && data.response != null) {
                data.response.shippingGroupList[0].cur = "1";
                data.response.shippingGroupList.forEach(function(item,index) {
                    item.shippingisopen = false; //配送信息增加展开收起标示
                    item.dialogVisible = false; //取消配送单弹层
                    item.showbtn = false; //查看收货人电话
                    item.ischeck = false; //查看自提码或签收码
                    item.codingtext = ""; //自提码或签收码内容
                    item.commerceItemList.forEach(function(prditem) {
                    //商品信息增加展开收起标示
                    prditem.show = false;
                    });
                    item.shippingInstallList.forEach(function(prditem) {
                    //商品安装信息增加展开收起标示
                        prditem.installisopen = false;
                    });
                    item.invoiceInfoList.forEach(function(invoitem) {
                    //发票信息增加展开收起标示
                        invoitem.show = false;
                    });
                    //从列表页点进来，是那个配送单就展开哪个配送单
                    if(item.shippingGroupId == _this.shippingGroupId){
                        
                         _this.activeNames = [];
                         _this.activeNames.push(index);
                    }

                });
                _this.response = data.response;
            } else {
                _this.$message({
                    message: data.respMsg,
                    type: "error"
                });
            }
        });
        },
        formatInvoiceMediaType: function(row, column, cellValue) {
        //发票媒介类型
        if (cellValue === 0) {
            return "不开发票";
        } else if (cellValue === 1) {
            return "纸质发票";
        } else if (cellValue === 2) {
            return "电子发票";
        }
        },
        formatinvoiceState: function(row, column, cellValue) {
        //发票状态
        if (cellValue === 0) {
            return "不开发";
        } else if (cellValue === 1) {
            return "未开票";
        } else if (cellValue === 2) {
            return "已开票";
        } else if (cellValue === 3) {
            return "已作废";
        } else if (cellValue === 4) {
            return "已冲红";
        } else if (cellValue === 5) {
            return "虚拟开票";
        } else if (cellValue === 6) {
            return "发票冲红";
        }
        },
        formatInvoiceHeadType: function(row, column, cellValue) {
        //发票抬头类型  0-个人、1-单位（企业）
        if (cellValue === 0) {
            return "个人";
        } else if (cellValue === 1) {
            return "单位（企业）";
        }
        },
        formatinvoiceBack: function(row, column, cellValue) {
        //发票是否收回  0-未确认收回、1-已确认收回
        if (cellValue === 0) {
            return "未确认收回";
        } else if (cellValue === 1) {
            return "已确认收回";
        }
        },
        lookTelNum: function(itemitem) {
        //查看完整手机号
        API.lookTelNum({
            shippingGroupId: itemitem.shippingGroupId
        }).then(function(data) {
            if (data.success && data.response != null) {
            itemitem.showbtn = true;
            itemitem.consigneePhone = data.response;
            } else {
            _this.$message({
                message: data.respMsg,
                type: "error"
            });
            }
        });
        },
        checkmemberPhone: function() {
        //查看完整会员手机号
        let _this = this;
        API.memberPhone({
            storeCode: _this.storeCode,
            orderId: _this.orderId
        }).then(function(data) {
            if (data.success && data.response != null) {
            _this.response.showbtn = true;
            _this.response.memberPhone = data.response.phone;
            } else {
            _this.$message({
                message: data.respMsg,
                type: "error"
            });
            }
        });
        },
        ShippingResume: function(shippingItem) {
        //配送履历
        let _this = this;
        if (shippingItem.shippingisopen) {
            shippingItem.shippingisopen = !shippingItem.shippingisopen;
        } else {
            //alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
            API.orderShippingResume({
                storeCode: this.response.storeCode,
                orderId: this.response.orderId,
                shippingGroupId: shippingItem.shippingGroupId
            }).then(function(data) {
                if (data.success) {
                    shippingItem.shippingisopen = !shippingItem.shippingisopen;
                    shippingItem.shippingResumeList = data.response;
                } else {
                    _this.$message({
                    message: data.respMsg,
                    type: "error"
                    });
                }
            });
        }
        },
        InstallResume: function(installItem, shippingItem) {
        //安装履历
            if (installItem.installisopen) {
                installItem.installisopen = !installItem.installisopen;
            } else {
                //alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId+"commerceItemId:"+installItem.commerceItemId)
                API.orderInstallResume({
                storeCode: this.response.storeCode, //销售门店
                orderId: this.response.orderId, //订单号
                shippingGroupId: shippingItem.shippingGroupId, //配送单号
                commerceItemId: installItem.commerceItemId //商品唯一号
                }).then(function(data) {
                if (data.success) {
                    installItem.installisopen = !installItem.installisopen;
                    installItem.installResumeList = data.response;
                } else {
                    _this.$message({
                    message: data.respMsg,
                    type: "error"
                    });
                }
                });
            }
        },
        //取消订单
        cancelOrder: function(shippingItem, shippingPromotion) {
        let _this = this;
        // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
        API.cancelOrder({
            orderId: this.orderId, //订单号
            shippingGroupId: shippingItem.shippingGroupId, //配送单号
            storeCode: this.storeCode, //销售门店
            reason: "" //取消原因
        }).then(function(data) {
            if (data.success) {
                shippingItem.dialogVisible = false;
                if (shippingPromotion == 1) {
                    //含促销
                    _this.$message({
                    showClose: true,
                    message: "申请提交成功！",
                    type: "success"
                    });
                } else if (shippingPromotion == 0) {
                    //不含促销
                    _this.$message({
                    showClose: true,
                    message: "订单取消成功",
                    type: "success"
                    });
                }
                setTimeout(function() {
                    _this.getPageData();
                }, 2000);
            //_this.$router.push({path:'/order/orderindex/'});
            // this.$router.push('/order/creatfilesdetaile/'+this.response.storeCode+'-'+this.response.orderId+'-'+this.response.shippingGroupList[0].commerceItemList[0].commerceItemId+'-1');
            } else {
            _this.$message({
                message: data.respMsg,
                type: "error"
            });
            shippingItem.dialogVisible = false;
            }
        });
        },
        //订单履历
        handleChange(val) {
        //订单履历 标题栏点击回调，val 是数组
        let _this = this;
        if (val.length > 0) {
            val.forEach(function(element) {
            if (element == 2) {
                //订单
                _this.queryorder = true;
            } else {
                _this.queryorder = false;
            }
            if (element == 4) {
                //退货
                _this.returninfo = true;
            } else {
                _this.returninfo = false;
            }
            }, this);
        } else {
            _this.queryorder = false;
            _this.returninfo = false;
        }
        },
        //跳转
        jumpto(path, parms) {
        //跳转页面
        //this.$router.push(to?to:'/order/orderindex');
        let routeData = this.$router.resolve({ path: path, query: parms });
        window.open(routeData.href, "_blank");
        },
        //发送延保
        sendinsurance(parentitem,prdItem) {
            this.dialogFormVisible = true;
            this.delateForm.email =JSON.parse(JSON.stringify(prdItem.sendWarrantyAgreementEmail))||'';
            this.sendinsuranceData={
                shippingGroupId: parentitem.shippingGroupId,
                commerceItemId: prdItem.commerceItemId,
                commerceItemName: prdItem.displayName,
                targetEmail:this.delateForm.email 
            };
        },
        sendFormEvent() {//发送延保按钮
            let that = this;
            let notEmail = !/^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/.test(this.delateForm.email);
            if (notEmail) {
                this.$refs.insuranceInput.blur();
                return;
            };
            let parms =this.sendinsuranceData;
            parms.targetEmail=this.delateForm.email ;
            API.sendInsurance(parms).then(function(data) {
                if (data.success) {
                    that.$message({
                        message: "发送成功",
                        type: "success"
                    });
                    that.dialogFormVisible = false;
                } else {
                    if(data.respMsg !='' && data.respMsg !=null){
                        that.$message({
                            message: data.respMsg,
                            type: "error"
                        });
                    };  
                }
            });
        },
        resendMesg(item) {
            //自提码重新发送短信,弹层出现，自动获取默认手机号
            let that = this;
            that.MessageForm.tel = ""; //清空输入框
            that.istelerroe = false; //清空校验规则
            that.dialogResend = true;
            that.myshippingGroupId = item.shippingGroupId;
           // alert(that.myshippingGroupId)
            //获取接受短信的手机号
            /*1、临时卡，自提时无手机号时，手机号框中为空;2、临时卡，国美配送+厂家带货安装时，手机号默认取地址中的手机号； 3、会员卡号时，自提时默认取会员账户里的手机号；4、会员卡号，国美配送+厂家带货安装时，手机号默认取地址中的手机号 */
            if (that.response.cardFlag == 1 && item.billShippingMethod == 2) {
                //临时且自提
                that.MessageForm.tel = "";
            } else if ((that.response.cardFlag == 1 && item.billShippingMethod != 2) || (that.response.cardFlag == 0 && item.billShippingMethod != 2)) {
                //临时且国美配送+厂家带货安装||会员卡号，国美配送+厂家带货安装
                API.lookTelNum({
                    shippingGroupId: item.shippingGroupId
                }).then(function(data) {
                if (data.success && data.response != null) {
                    that.MessageForm.tel = data.response;
                }
                });
            } else if (that.response.cardFlag == 0 && item.billShippingMethod == 2) {
                //会员且自提
                API.memberPhone({
                    storeCode: that.storeCode,
                    orderId: that.orderId
                }).then(function(data) {
                    if (data.success && data.response != null) {
                        that.MessageForm.tel = data.response.phone;
                    }
                });
            } else {
                that.MessageForm.tel = "";
            }
        },
        //关闭重新发送
        dialogResendClose(item){
            this.dialogResend = false;
            if (event) event.stopPropagation();
        },
        sendMesgEvent() {
            //点击发送短信
            let that = this;
            if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(this.MessageForm.tel)) {
                this.istelerroe = true;
                this.$refs.MessageInput.blur();
                return;
            } 
            let params = {
                storeCode: this.response.storeCode, //销售门店,
                orderId: this.response.orderId, //订单号
                shippingGroupId: this.myshippingGroupId, //配送单号,
                mobile: this.MessageForm.tel //目标手机号
            };
            API.sendMessage(params).then(function(data) {
                if (data.success && data.response != null) {
                    that.$message({
                        message: "短信发送成功",
                        type: "success"
                    });
                    that.dialogResend = false;
                } else {
                    that.$message({
                        message: data.respMsg,
                        type: "error"
                    });
                }
            });
        },
        //查看提货码或签收码(临时卡)
        viewCoding(item) {
            let that = this;
            let params = {
                storeCode: this.response.storeCode, //销售门店,
                orderId: this.response.orderId, //订单号
                shippingGroupId: item.shippingGroupId //配送单号,
            };
            API.viewCoding(params).then(function(data) {
                if (data.success && data.response != null) {
                    item.ischeck = true;
                    item.codingtext = data.response;
                } else {
                that.$message({
                    message: data.respMsg,
                    type: "error"
                });
                }
            });
        },
        //查看提货码或签收码（会员卡）
        viewCodingMember(item) {
            //查看提货码或签收码
            let that = this;
            let params = {
                storeCode: this.response.storeCode, //销售门店,
                orderId: this.response.orderId, //订单号
                shippingGroupId: item.shippingGroupId //配送单号,
            };
            API.viewCodingMember(params).then(function(data) {
                if (data.success && data.response != null) {
                    item.ischeck = true;
                    item.codingtext = data.response;
                } else {
                that.$message({
                    message: data.respMsg,
                    type: "error"
                });
                }
            });
        },
        //购买延保（补够延保）
        buyInsurance(item,shippingItem){//配送单号,商品ID,销售门店为10月12号接入层接口修改新增的参数
            var that =this;
            
            that.insuranceDialogVisible =false;
            let params={
                skuNo:item.skuNo,//商品skuNo
                gomePrice:item.salePrice,//国美价
                organCode:this.response.salesOrganization,//销售组织
                shippingGroupId:shippingItem.shippingGroupId,//配送单号
                commerceItemId:item.commerceItemId,//商品ID
                storeId:this.response.storeCode//销售门店
            };
            let addIncrement={
                commerceItemId:item.commerceItemId,//商品ID
                shippingGroupId:shippingItem.shippingGroupId//配送单号
            };
            
            API.buyYanbao(params).then(function(data) {
                if (data.success && data.response != null) {
                    that.insuranceDialogVisible=true;  //调子组件                  
                    that.insuranceData = data.response;
                    that.insuranceData.addIncrement = addIncrement;
                } else {
                that.$message({
                    message: data.respMsg,
                    type: "error"
                });
                }
            });
        },
        //获取补够延保子组件的数据
        getdialogvisible(value) {
            var that=this;
           // alert(value)
            if(value){               
                that.insuranceDialogVisible=value;                
            }        
        },
        //拒收和确认收货
        rejectionOrder(shippingItem,fnname){
            if(fnname==1){//拒收
                this.rejectionDialog =true;
            }else if(fnname==2){//确认收货confirmReceipt
                this.receiptDialog =true;
            };
            this.rejectionMesg={
                shippingGroupId: shippingItem.shippingGroupId, //配送单号
            }

        },
        //拒收确认
        rejectionOrderquery(){
            var _this =this;
            let params={
                orderId:this.orderId,//订单号
                shippingGroupId:this.rejectionMesg.shippingGroupId,//配送单号
                storeCode:this.storeCode//销售门店
            };
            API.rejectionOrder(params).then(function(data){
                if (data.success && data.response != null) {
                    _this.rejectionDialog =false;
                    _this.$message({
                        showClose: true,
                        message: "拒收成功，需服务台审核后才可退款。",
                        type: "success"
                    });
                    setTimeout(function() {
                        _this.getPageData();
                    }, 2000);
                } else {
                    _this.rejectionDialog =false;
                    _this.$message({
                        message: data.respMsg,
                        type: "error"
                    });
                    _this.getPageData();
                }
            })
            // this.$router.push('/order/refuseDelivery_detail/?orderId='+this.orderId+'&shippingGroupId='+this.rejectionMesg.shippingGroupId+'&storeCode='+this.storeCode);
        },
        //确认收货
        confirmReceipt(){
            var _this =this;
            let params={
                orderId:this.orderId,//订单号
                shippingGroupId:this.rejectionMesg.shippingGroupId,//配送单号
                storeCode:this.storeCode//销售门店
            };
            API.confirmOrder(params).then(function(data){
                if (data.success && data.response != null) {
                    _this.receiptDialog =false;
                    _this.$message({
                        showClose: true,
                        message: "确认收货成功",
                        type: "success"
                    });
                    setTimeout(function() {
                        _this.getPageData();
                    }, 2000);
                } else {
                    _this.receiptDialog =false;
                    _this.$message({
                        message: data.respMsg,
                        type: "error"
                    });
                    setTimeout(function() {
                        _this.getPageData();
                    }, 2000);
                }
            })
            // this.$router.push('/order/refuseDelivery_detail/?orderId='+this.orderId+'&shippingGroupId='+this.rejectionMesg.shippingGroupId+'&storeCode='+this.storeCode);
        },
    },
    mounted() {
        this.getPageData();
        this.cookieDomain = Env.cookieDomain;
    },
    filters: {
        formatDate(time) {
            if (time != null) {
                let date = new Date(time);
                return formatDate(date, "yyyy-MM-dd hh:mm:ss");
            }
        },
        formatInvoiceType(cellValue){
            //发票类型
            if (cellValue === 0) {
                return "普通发票";
            } else if (cellValue === 1) {
                return "增值税发票";
            }
        },
        formatInvoiceMediaType: function(cellValue) {
            //发票媒介类型
            if (cellValue === 0) {
                return "不开发票";
            } else if (cellValue === 1) {
                return "纸质发票";
            } else if (cellValue === 2) {
                return "电子发票";
            }
        },
        formatinvoiceState: function(cellValue) {
            //发票状态
            if (cellValue === 0) {
                return "不开发";
            } else if (cellValue === 1) {
                return "未开票";
            } else if (cellValue === 2) {
                return "已开票";
            } else if (cellValue === 3) {
                return "已作废";
            } else if (cellValue === 4) {
                return "已冲红";
            } else if (cellValue === 5) {
                return "虚拟开票";
            } else if (cellValue === 6) {
                return "发票冲红";
            }
        },
        formatInvoiceHeadType: function(cellValue) {
            //发票抬头类型  0-个人、1-单位（企业）
            if (cellValue === 0) {
                return "个人";
            } else if (cellValue === 1) {
                return "单位（企业）";
            }
        },
        formatinvoiceBack: function(cellValue) {
            //发票是否收回  0-未确认收回、1-已确认收回
            if (cellValue === 0) {
                return "未确认收回";
            } else if (cellValue === 1) {
                return "已确认收回";
            }
        },
        formatvatAuditState(cellValue){//增票审核状态
            if (cellValue === 1) {
                return "审核通过";
            } else if (cellValue === 2) {
                return "审核中";
            }else if (cellValue === 3) {
                return "审核未通过";
            }else if (cellValue === 4) {
                return "资质已过期";
            }else if (cellValue === 5) {
                return "状态异常";
            }else{
                return "状态异常";
            }
        }
    },
    watch: {
        queryorder: function() {
            let _this = this;
            if (this.queryorder) {
                //订单履历
                API.queryOrder({
                storeCode: this.response.storeCode, //销售门店
                orderId: this.response.orderId //订单号
                }).then(function(data) {
                if (data.success) {
                    _this.response.orderHistoryList = data.response;
                } else {
                    _this.$message({
                    message: data.respMsg,
                    type: "error"
                    });
                }
                });
            }
        },
        returninfo: function() {
        //退货信息
            let _this = this;
            if (this.returninfo) {
                API.queryreturninfo({
                storeCode: this.response.storeCode, //销售门店
                orderId: this.response.orderId //订单号
                }).then(function(data) {
                if (data.success) {
                    _this.response.returnRequestList = data.response;
                } else {
                    _this.$message({
                    message: data.respMsg,
                    type: "error"
                    });
                }
                });
            }
        },
        insuranceData:{
            handler:function(){
                this.buyInsuranceData = this.insuranceData;
            },
            deep: true
        },
        insuranceDialogVisible:{
            handler:function(){
                this.prarentinsuranceDialogVisible = this.insuranceDialogVisible;
            },
            deep: true
        }
    },
    computed: {
        ...mapState({
        //vuex取值
        LOGINDATA: "LOGINDATA"
        }),
        pagelink(){
            return '//mpf' + this.cookieDomain + '/service/helpCenter/commonProblem'
        }
    },
    components: {
        ExtendedWarranty
    }
};
</script>
<style>
.red{
    color:#F56C6C;
}
.mt10 {
  margin-top: 10px;
}
.mt20 {
  margin-top: 20px;
}
.order_detailsbox {
  position: relative;
  min-height: 800px;
}
.order_details_l {
  margin-right: 320px;
  border: 1px solid #e4e7ed;
}
.order_details_r {
  position: fixed;
  width: 300px;
  border: 1px solid #e4e7ed;
  right: 20px;
  top: 20px;
}
.orderinfo,
.payinfor {
  width: 280px;
  margin: 10px auto;
  background: #f2f6fc;
  color: #303133;
  padding: 5px 0;
}
.orderinfo .item {
  width: 260px;
  display: flex;
  /* height: 30px; */
  line-height: 30px;
  padding-left: 20px;
}
.orderinfo .item .label {
  /* flex: 0 0 100px; */
  text-align: right;
}
.orderinfo .item .info-rcol {
  flex: 1;
  text-align: left;
}
.ml10 {
  margin-left: 10px;
}
.ml20 {
  margin-left: 20px;
}
.ml40 {
  margin-left: 40px;
}
.mr20 {
  margin-right: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.payinfor {
  background: #ebeef5;
  font-size: 12px;
}
.payinfor .item {
  width: 220px;
  display: flex;
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
}
.payinfor .item .label {
  /* flex: 0 0 200px; */
  text-align: right;
}
.payinfor .item .info-rcol {
  flex: 1;
  text-align: left;
}
.el-collapse-item__arrow {
  height: 35px;
  line-height: 35px;
}
.order_details_cont {
  padding: 20px;
}
/*配送单下拉*/
.content {
  border: 1px solid #e4e7ed;
  padding: 10px;
}
.states {
  display: flex;
  border-bottom: 1px solid #409eff;
  height: 39px;
  margin-bottom: 20px;
}
.states .states_l {
  position: relative;
  flex: 0 0 300px;
  line-height: 40px;
  text-align: left;
  font-weight: bold;
}
.states .states_r {
  flex: 1;
  text-align: right;
}
.content_title {
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}
thead.has-gutter th {
  background: #eef6ff;
  padding: 8px;
  font-size: 12px;
}
.el-table__body td {
  padding: 5px 0;
  font-size: 12px;
}
.shippingbtn_icon {
  font-size: 18px;
  cursor: pointer;
}
/* 配送信息 */
.dispatching_box {
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 10px;
}
.dispatching_box .item,
.ordercont_box .item {
  line-height: 30px;
  display: flex;
  color: #909399;
}
.ordercont_box .item {
  color: #303133;
}
.dispatching_box .item .item_time,
.ordercont_box .item .item_time {
  flex: 0 0 180px;
  margin-left: 50px;
}
.dispatching_box .item .item_cont,
.ordercont_box .item .item_cont {
  flex: 1;
}
.commontitle {
  height: 35px;
  line-height: 35px;
  padding-left: 15px;
  background: #ebeef5;
  color: #303133;
}
.commontitle_1,
.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
  overflow: hidden;
  clear: both;
}
.paymentmesg {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.paymentmesg1 {
  display:flex;
  line-height: 30px;
}
.paymentmesg1 .title{
    flex:0 0 100px;
    text-align:right;
}
.ordercont_box {
  border: none;
  padding: 10px;
}
.gifttipsmesg {
  color: #909399;
  margin-bottom: 10px;
}
/* 多行文本溢出 */
.ellipsis {
  overflow: hidden;
  height: 46px;
  line-height: 23px;
}

.ellipsis:before {
  content: "";
  float: left;
  width: 5px;
  height: 46px;
}

.ellipsis > *:first-child {
  float: right;
  width: 100%;
  margin-left: -5px;
}

.ellipsis:after {
  content: "...";
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  float: right;
  position: relative;
  top: -25px;
  left: 100%;
  width: 13px;
  margin-left: -13px;
  padding-right: 5px;
  text-align: right;
  background: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover .ellipsis:after {
  background: #f5f7fa;
}
.orderdetails_subtitle .el-collapse-item__header {
  height: 35px;
  line-height: 35px;
  padding-left: 15px;
  background: #ebeef5;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
  font-size: 12px;
  font-weight: normal;
}
.el-collapse {
  border: none;
}
.el-dialog__header,
.el-dialog__body {
  text-align: left;
}
.el-collapse-item__header.focusing:focus:not(:hover) {
  color: #fff;
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-table--border::after,
.el-table--group::after {
  width: 0;
}
/* 自提 */
.shippingtype {
  margin-right: 20px;
  display: inline-block;
  width: 150px;
}
.inline {
  display: inline;
}
/*赠品分摊*/
.giftbox_title{
    border-bottom:solid 1px #ebeef5;
}
.orderstatusTip{
    transform-origin: left center 0px; 
    z-index: 2087; 
    position: absolute; 
    top: 5px; 
    left: 90px;
    width:340px
}
.orderstatusTip1{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 90px;
    width:280px;
    top: 5px;
}
.orderstatusTip2{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 70px;
    width:230px;
    top: 5px;
}
.giftbox_cont{
    padding:0px 10px 20px;
    font-family: 12px/1.5 arial,"\65B0\5B8B\4F53"
}
.giftbox_mesg{
    height: 40px;
    line-height:40px;
    font-size: 12px;
}
.giftbox_cont thead.has-gutter th{
    padding:8px 0;
    text-align: center;
}
.giftbox_cont td{
    padding:0px
}
.giftbox_cont td.bordernone{
    border-bottom:none;
}
.giftbox_cont td.pad8{
    height:46px;
} 
.giftbox_cont .pdtop5{
    padding:0px 5px;
    white-space: normal;
    word-break: break-all;
}
.giftbox_cont td.borderright{
    border-right:none;
}
.giftbox_cont .giftlink,.giftbox_cont .giftlink a,.giftlink a,.giftlink{
    font:12px/30px "Microsoft Yahei";
    text-align:right;
    color:#409eff;
}
.el-icon-question,.cursor{
    cursor: pointer;
}
.el-tooltip__popper.is-light{
    border: 1px solid #FFFFCC;
    color: #FF161A;
    background: #FFFFCC;
    font-weight: normal;
    padding:5px 10px;
    z-index:10;
}
.el-tooltip__popper.is-light[x-placement^=right] .popper__arrow {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper[x-placement^=right] .popper__arrow::after {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper.is-light[x-placement^=right] .popper__arrow::after {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper.is-custom[x-placement^=bottom] .popper__arrow,.el-tooltip__popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #E6A23C;
}
@-moz-document url-prefix(){.letterspace{letter-spacing:-2px;}}/*仅firefox 识别*/ 
.orderTipbtn{
    border:none;
    font-size:12px;
    color:#409eff;
}
.indent20{
    text-indent: 20px;
}
.orderTipbtn:hover{
    background:none;
}
.indent20,.ordertipcont{
    line-height: 24px;
}
.el-tooltip__popper.is-custom{
    border: 1px solid #E6A23C;
    background: #FFF;
    font-weight: normal;
    padding:5px 10px;
    z-index:10;
}
</style>




