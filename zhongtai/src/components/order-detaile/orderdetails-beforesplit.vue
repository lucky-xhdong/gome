<template>
<div class="order_detailsbox">
    <div class="order_details_l"> 
        <el-collapse v-model="pageactiveNames" class="orderdetails_title" @change="handleChange">
            <el-collapse-item title="配送" name="1">
                <div class="order_details_cont">
                    <!-- 配送单 -->
                    <div class="commontitle">配送单：{{response.shippingGroupId}}</div>               
                    <div class="content">
                        <div v-for="(shippingItem,index) in response.shippingGroupList" :key="shippingItem.id">
                            <!-- 收货人表格 -->
                            <div v-if="shippingItem.consigneeName || shippingItem.consigneePhone || shippingItem.consigneeAddress" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small "> 
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
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneeName}}</div>
                                            </td>
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneePhone}}<el-button  v-if="!shippingItem.showbtn && LOGINDATA.orderplatform_orderBeforesplit_seeTel" @click="lookTelNum(shippingItem)" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                                </div>
                                            </td>
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneeAddress}}</div>                                           
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- 套装信息 -->
                            <div class="content_title" v-if="shippingItem.packageTab=='1'">套装<span class="fr">套装总价： ¥{{shippingItem.packagePrice}}</span></div>
                            <div class="content_title" v-else>商品信息</div>
                            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">   
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
                                    <thead class="has-gutter">
                                        <tr class="">
                                            <th width="5%"></th>
                                            <th class="is-center" width="10%">
                                                <div class="cell">商品名称</div>
                                            </th>
                                            <th class="is-center" width="10%">
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
                                            <th class="is-center" width="6%">
                                                <div class="cell">业务机型</div>
                                            </th>
                                            <th class="is-center" width="8%">
                                                <div class="cell">导购员编号</div>
                                            </th>
                                            <th class="is-center" width="10%">
                                                <div class="cell">导购员姓名</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell">配送方式</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell" style="width:70px;">配送时间</div>
                                            </th>
                                            <th class="is-center" width="6%">
                                                <div class="cell">安装方式</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell" style="width:70px;">安装时间</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.commerceItemList" :key="prdItem.id">
                                        <tr class="el-table__row">
                                            <td class="is-center">
                                                <i v-if='prdItem.salesPromotionList.length !=0' class="shippingbtn_icon" @click="prdItem.show=!prdItem.show" v-bind:class="prdItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                            </td>
                                            <td class="is-center">
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
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.skuNo}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell" v-if="prdItem.isBarterGoods ==1">
                                                    <div>售价：{{prdItem.salePrice}}</div>
                                                    <div>换购价：{{prdItem.promPrice}}</div>
                                                </div>
                                                <div class="cell" v-else>
                                                    {{prdItem.salePrice}}
                                                </div> 
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.quantity}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.brandName}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.salesModel}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.guiderCode}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.guiderName}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.shippingMethod}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.appointmentDeliveryDate}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.installMethod}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.appointmentInstallDate}}</div>
                                            </td>
                                        </tr>
                                        <tr class="el-table__row" style="background:#EBEEF5;" v-if='prdItem.show && prdItem.salesPromotionList.length !=0'>
                                            <td colspan="13">
                                                <div class="ml40">
                                                    <div class="paymentmesg" v-for="salesItem in prdItem.salesPromotionList" :key="salesItem.id"><span class="mr20">{{salesItem.promotionName}}：{{salesItem.promotionDesc}}</span></div>
                                                    <div class="gifttipsmesg">赠美豆在订单收款后发放至顾客的会员账户</div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="content_title"  v-if="shippingItem.refundFlag == 1">退款信息</div>
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
                            <div class="order_line"></div>
                        </div>
                    </div>
                </div> 
            </el-collapse-item>
            <el-collapse-item title="订单赠品信息" name="2" v-if="response.orderPromotion && ((response.orderPromotion.orderGiftInfoList && response.orderPromotion.orderGiftInfoList.length!=0) || (response.orderPromotion.orderPromotionList && response.orderPromotion.orderPromotionList.length!=0))">
            <!-- 订单赠品信息 -->
                <div class="ordercont_box">
                    <div class="paymentmesg" v-for="(item,index) in response.orderPromotion.orderPromotionList" :key="item.id"><span class="mr20">{{item.promotionName}}：{{item.promotionDesc}}</span></div>
                    <div class="gifttipsmesg" v-if="response.orderPromotion.orderPromotionList && response.orderPromotion.orderPromotionList.length!=0">赠美豆在订单收款后发放至顾客的会员账户</div>
                    <div v-if="response.orderPromotion.orderGiftInfoList[0].giftItemList.length!=0">
                        <div v-for="(zengitem,index) in (response.orderPromotion.orderGiftInfoList)" :key="zengitem.id">
                            <!-- 赠品收货人表格 -->
                            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">                   
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
                                            <td class="is-center">
                                                <div class="cell">{{zengitem.consigneeName}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{zengitem.consigneePhone}}<el-button v-if="!zengitem.showbtn"  @click="lookgiftTelNum(zengitem)" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                                </div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{zengitem.consigneeAddress}}</div>                                           
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- 赠品信息列表 -->
                            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small mt20" style="overflow-x:auto;">
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
                                    <thead class="has-gutter">
                                        <tr class="">
                                            <th class="is-center" width="13%">
                                                <div class="cell">商品名称</div>
                                            </th>
                                            <th class="is-center" width="10%">
                                                <div class="cell">商品编码</div>
                                            </th>
                                            <th class="is-center" width="7%">
                                                <div class="cell">价格</div>
                                            </th>
                                            <th class="is-center" width="6%">
                                                <div class="cell">数量</div>
                                            </th>
                                            <th class="is-center" width="7%">
                                                <div class="cell">品牌</div>
                                            </th>
                                            <th class="is-center" width="6%">
                                                <div class="cell">业务机型</div>
                                            </th>
                                            <th class="is-center" width="8%">
                                                <div class="cell">导购员编号</div>
                                            </th>
                                            <th class="is-center" width="10%">
                                                <div class="cell">导购员姓名</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell">配送方式</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell" style="width:70px;">配送时间</div>
                                            </th>
                                            <th class="is-center" width="6%">
                                                <div class="cell">安装方式</div>
                                            </th>
                                            <th class="is-center" width="9%">
                                                <div class="cell" style="width:70px;">安装时间</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="el-table__body" v-for="(prdItem,index) in zengitem.giftItemList" :key="prdItem.id">
                                        <tr class="el-table__row">
                                            <td class="is-center">
                                                <div class="cell ellipsis" :title="prdItem.displayName">
                                                    <div>
                                                    <el-tag type="danger" v-if="prdItem.type ==2" size="mini">赠品</el-tag>
                                                    <!-- <el-tag type="info" v-if="prdItem.type ==3" size="mini">延保</el-tag> -->
                                                    <el-tag  v-if="prdItem.packageTab ==1" size="mini">套装</el-tag>
                                                    <el-tag v-if="prdItem.preSellTab ==1" type="success" size="mini">预售</el-tag>
                                                    {{prdItem.displayName}}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.skuNo}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.salePrice}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.quantity}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.brandName}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.salesModel}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.guiderCode}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.guiderName}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.shippingMethod}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.appointmentDeliveryDate}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.installMethod}}</div>
                                            </td>
                                            <td class="is-center">
                                                <div class="cell">{{prdItem.appointmentInstallDate}}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="order_line"></div>
                        </div>
                    </div>
                    
                </div>   
            </el-collapse-item>
            <el-collapse-item title="发票信息" name="3" v-if="response.storeFlag!=1">
                <!-- 发票信息 -->
                <div class="ordercont_box">
                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">                          
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                            <thead class="has-gutter">
                                <tr class="el-table__row">
                                    <th width="5%"></th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">发票类型</div>
                                    </th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">发票抬头</div>
                                    </th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">购方税号</div>
                                    </th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">发票内容</div>
                                    </th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">手机号</div>
                                    </th>
                                    <th class="is-center" width="13%">
                                        <div class="cell">邮箱地址</div>
                                    </th>
                                    <th class="is-center" width="17%">
                                        <div class="cell">操作</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="el-table__body" v-for="(invoiceItem,index) in invoiceOriginal" :key="invoiceItem.id">
                                <tr class="el-table__row">
                                    <td class="is-center ">
                                        <i class="shippingbtn_icon" v-if="invoiceItem.invoiceType==1" @click="invoiceItem.show=!invoiceItem.show" v-bind:class="invoiceItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                    </td>
                                    <td class="is-center ">
                                        <div class="cell">{{invoiceItem.invoiceType | formatInvoiceType}}</div>
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
                                        <div class="cell">{{invoiceItem.elecMobile}}</div>                                           
                                    </td>
                                    <td class="is-center ">
                                        <div class="cell">{{invoiceItem.elecMail}}</div>                                           
                                    </td>
                                    <td class="is-center ">
                                        <div class="cell">
                                            <el-button v-if="LOGINDATA.orderplatform_orderBeforesplit_modifyConfirm && response.canChangeInvoice==1 && invoiceItem.invoiceType!=1"  type="text" size="small" @click="changeInvoice">修改发票</el-button>
                                        </div>                
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
                            <tbody class="el-table__body" v-if="invoiceOriginal.length ==0">
                                <tr>
                                    <td colspan="8" class="is-center ">
                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                    </td>
                                </tr> 
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="订单履历" name="4">
                <!-- 订单履历 -->
                <div class="ordercont_box">
                    <ul>
                        <li class="item" v-for="item in response.orderHistoryList" :key="item.id">
                            <span class="item_time">{{item.stateDate | formatDate}}</span><span class="item_cont">{{item.description}}</span>
                        </li>
                    </ul>
                    <div class="ordercont_box" v-if="!response.orderHistoryList">暂无信息</div>
                </div>                
            </el-collapse-item>
        </el-collapse>

    </div>
    <div class="order_details_r">
        <g-header v-model="righttitle"></g-header>
        <div class="orderinfo" v-if="response.orderId || response.submittedDate || response.state">
            <div class="item" v-if="response.orderId">
                <span class="label">订单编号： </span> 
                <div class="info-rcol">{{response.orderId}}</div> 
            </div>
            <div class="item" v-if="response.submittedDate">
                <span class="label"> 下单时间：</span> 
                <div class="info-rcol">{{response.submittedDate | formatDate}}</div> 
            </div>
            <div class="item">
                <span class="label" v-if="response.state"> 订单状态：</span> 
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
                <div class="info-rcol">{{response.memberPhone}}<el-button v-if="!response.showbtn && LOGINDATA.orderplatform_orderBeforesplit_seeMemberTel" @click="checkmemberPhone" type="primary" size="mini" class="ml10">查看</el-button></div>
            </div>
        </div>
        <div class="orderinfo" v-if="response.payMethod || response.payType || response.siteId">
            <div class="item" v-if="response.payType">
                <span class="label">支付类型： </span> 
                <div class="info-rcol">{{response.payType}}</div> 
            </div>
            <div class="item" v-if="response.payMethod">
                <span class="label">支付方式：</span> 
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
            <div class="item" v-for="(item, index) in response.paymentGroupList" :key="item.id">
                <span class="label">{{item.paymentMethodName}}：</span> 
                <div class="info-rcol">¥{{item.payAmount}}</div> 
            </div>
            <div class="item mt10">
                <span class="label">实收金额总计：</span> 
                <div class="info-rcol">¥{{response.orderPaidAmount}}</div> 
            </div>
        </div>
        <div class="orderctrolbox">           
            <el-button type="primary" size="small" @click="delateReasonlist" v-if="LOGINDATA.orderplatform_orderBeforesplit_delete && response.canDelete==1">删单</el-button>
            <el-button type="primary" size="small" @click="dialogVisible = true" v-if="LOGINDATA.orderplatform_orderBeforesplit_cancel && response.canCancel==1">取消订单</el-button>
            <el-button type="primary" size="small"  @click="selectedtype" v-if="LOGINDATA.orderplatform_orderBeforesplit_select && response.canSelectBizType ==1">选择机型</el-button>
            <!-- 一码付 -->
            <div class="inline" v-if="response.storeFlag==1">
                <el-button type="info" size="small" disabled @click="payFor" v-if="LOGINDATA.orderplatform_orderBeforesplit_receivables && response.payFlag==1">立即收款</el-button>   
                <el-button type="info" size="small" disabled  @click="payFor" v-else-if="LOGINDATA.orderplatform_orderBeforesplit_deposit && response.payFlag==2">收定金</el-button>
                <el-button type="info" size="small" disabled  @click="payFor" v-else-if="LOGINDATA.orderplatform_orderBeforesplit_finalpayment && response.payFlag==3">收尾款</el-button>
                <p class="red line32" v-if="(LOGINDATA.orderplatform_orderBeforesplit_receivables && response.payFlag==1) || (LOGINDATA.orderplatform_orderBeforesplit_deposit && response.payFlag==2) || (LOGINDATA.orderplatform_orderBeforesplit_finalpayment && response.payFlag==3)">请前往收银台去支付！</p>
            </div>
            <div class="inline" v-else>
                <el-button type="primary" size="small" @click="payFor" v-if="LOGINDATA.orderplatform_orderBeforesplit_receivables && response.payFlag==1">立即收款</el-button>   
                <el-button type="primary" size="small"  @click="payFor" v-else-if="LOGINDATA.orderplatform_orderBeforesplit_deposit && response.payFlag==2">收定金</el-button>
                <el-button type="primary" size="small"  @click="payFor" v-else-if="LOGINDATA.orderplatform_orderBeforesplit_finalpayment && response.payFlag==3">收尾款</el-button>
            </div>
            
        </div>
    </div>
    <!-- 选择机型弹层 -->
    <el-dialog title="选择商品" :visible.sync="dialogsearchFormVisible" width="830px" align="left" :lock-scroll="false">
        <el-form :inline="true" size="mini">
            <el-row style="height:300px;overflow-y:auto;">
                <el-table :data="aptList" border style="width: 100%" :show-header="true">
                    <el-table-column prop="itemTypeName" label="业务机型"align="center" width="230px">
                        <template slot-scope="scope">
                            {{scope.row.itemTypeName}}（在库{{scope.row.qty}}，在途{{scope.row.abQty}}）
                        </template>
                    </el-table-column>
                    <el-table-column prop="poolFlag" width="70" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.poolFlag=='Y'">联营</div>
                            <div v-else-if="scope.row.poolFlag=='N'">非联营</div>
                            <div v-else></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="logicMasLocDesc" label="仓库" align="center">
                        <template slot-scope="scope">
                            {{scope.row.logicMasLocDesc}}（编号{{scope.row.logicMasLoc}}）
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplierName" label="供应商" align="center" width="230px">
                        <template slot-scope="scope">
                            {{scope.row.supplierName}}（编号{{scope.row.supplier}}）
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" @click="confirmClick(scope.row)" v-if="LOGINDATA.orderplatform_orderBeforesplit_confirm">确认</el-button>      
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row type="flex"  justify="end" style="margin-top:20px" v-if="searchData.length!=0">
                <el-col :span="18">
                    <div class="block pagebox">
                        <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="searchPager.currentPage"
                        :page-size="searchPager.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="searchPager.totalPage">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
    <!-- 取消订单弹层 -->
     <el-dialog
        title="取消订单确认"
        :visible.sync="dialogVisible"
        width="30%"
        :lock-scroll="false">
        <span>您确定要取消配送单/订单？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="cancelOrder" v-if="LOGINDATA.orderplatform_orderBeforesplit_cancelSure">确 定</el-button>
        </span>
    </el-dialog> 
    <!-- 删单弹层 -->
    <el-dialog title="删单确认" :visible.sync="delateorderVisible" width="450px" align="left">
        <el-form :model="delateForm" label-width="90px" size="mini">
            <el-row>
            <el-col :span="24">
            <el-form-item label="删单原因：" left>
                <el-select v-model="delateForm.deleteReason " placeholder="请选择删单原因"> 
                    <el-option v-for="(list,index) in delateList" :key="index" :value="list.code" :label="list.name"></el-option>
                </el-select>
            </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="delateorderVisible = false"  size="mini">取 消</el-button>
            <el-button type="primary" @click="delateFormEvent()"  size="mini" v-if="LOGINDATA.orderplatform_orderBeforesplit_delete">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 选择机型选项后，点击“确认”时，选择的机型可卖数为0 -->
    <el-dialog title="提示" :visible.sync="queryOrderAPTVisible" width="30%">
        <span>该选项商品无货，请重新选择！</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="queryOrderAPTVisible = false">取 消</el-button>
            <el-button type="primary" @click="queryOrderAPTVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 选择机型选项后，点击“确认”时，选择的机型可卖数成功去建档 -->
    <el-dialog title="提示" :visible.sync="creatfilesVisible" width="30%" @close="creatfilesClose">
        <span>机型选择成功，请进行建档！</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="opencreatfiles" v-if="LOGINDATA.orderplatform_orderBeforesplit_creatfile">去建档</el-button>
        </span>
    </el-dialog>
    <!-- 弹窗：付款 -->
    <iframe v-show="isPayFor" id="payFrame" name="payFrame" pay-state="getPayStates" onload="this.style.height=document.body.clientHeight" height="100%" scrolling="auto" frameborder="0" width="100%" style="position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 999999999;" allowtransparency="true"></iframe>  
    <!-- 修改发票弹层 -->
    <el-dialog class="billInfo" title="发票信息" :lock-scroll="false" :visible.sync="InvoiceInformatione" width="780px" top="50px" max-height="500px" align="left" @close="close()">
        <el-form label-width="100px">
            <el-form-item label="发票类型：" class="is-required">
                <div class="span-info self-select-box active">电子发票<em data-v-5cd5f4e7="" class="select-icon"></em></div>
            </el-form-item>
            <el-form-item>
            <div class="div-danger">电子发票是增值税电子普通发票的简称，是国家税务总局认可的有效凭证。<br>其法律效力，基本用途，基本使用规定等与普通纸质发票相同，可用于用户报销，维权，保修。如你本次购买的商品暂未实现电子发票开具，我们将为你更换纸质发票。</div>
            </el-form-item>
            <el-form-item label="发票抬头：" class="is-required">
                <span class="span-info self-select-box"  @click="selectHead('0')" :class="headType!='1'?'active':''"  nstyle="margin-right:12px;">个人<em data-v-5cd5f4e7="" class="select-icon"></em></span>
                <span class="span-info self-select-box" @click="selectHead('1')" :class="headType=='1'?'active':''" >单位<em data-v-5cd5f4e7="" class="select-icon"></em></span>
            </el-form-item>
            <!-- ''表示还没有填过发票信息，'0'表示默认发票信息是个人 '1'表示默认发票是单位 -->
            <div v-show="headType!='1'">
                <invoicePersonel @getInvoice="getInvoice" :invoiceInfo="invoicePersonel.invoice"  :invoiceInfo2="invoicePersoneloriginal" :originaltel="originaltel" ref="clear"></invoicePersonel>
            </div>
            <div  v-show="headType=='1'">
                <invoiceUnit @getInvoice="getInvoice" :invoiceInfo="invoiceUnit.invoice" :invoiceInfo2="invoiceUnitoriginal" :originaltel="originaltel" ref="clear1"></invoiceUnit>
            </div>
            <el-form-item>
                <el-button type="primary"  v-if="LOGINDATA.orderplatform_orderBeforesplit_modifyConfirm" @click="saveInvoice()">保存发票信息</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 修改发票弹层 end-->
</div>
</template>
<script>
    import API from "@/api/orderDetail/orderdetailsbeforesplit";
    import commitAPT from "@/api/orderDetail/commitOrderAPT";
    import invoiceUnit from '@/components/order-detaile/invoiceUnit';
    import invoicePersonel from '@/components/order-detaile/invoicePersonel';
    import { formatDate } from "@/common/time";
    import {mapState,mapActions} from  'vuex';
    export default{
        data(){
            return {
                orderId: this.$route.query.orderId,
                storeCode: this.$route.query.storeCode,
                openstate:false,
                dialogVisible: false,//取消配送单弹层变量
                delateorderVisible:false,//删除订单弹层变量
                dialogsearchFormVisible: false,//选择机型弹层变量
                queryOrderAPTVisible:false,//选择的机型可卖数为0弹层
                creatfilesVisible:false,//选择的机型可卖数成功去建档
                i:-1,//商品列表收起展开变量
                isPayFor:false,//支付iframe是否展示
                invoice:false,//修改发票弹层
                dispatchingmesg:true,
                queryorder:false,//是否刷新履历
                pageactiveNames:["1"],//页面左侧第一个展开
                InvoiceInformatione:false,//修改发票信息弹层
                searchData: [],
                searchPager:{},
                lefttitle:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"配送" 
                },
                righttitle:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"订单信息" 
                },
                activeNames: ['1'],//配送默认展开控制
                response: {//页面信息
                    paymentGroupInfo: {},
                    orderPromotion:{}
                },
                aptList:[],
                //发票个人数据
                invoicePersonel:{ 
                    invoice:{
                        invoiceHead:'',
                        taxpayerNo:'',
                        elecMobile:'',
                        elecMail:'' ,
                        realNumber:''                    
                    },
                     headType:'0',
                    isHeadNull:true,
                    isTaxpayerNoNull:true,
                    isMobileNull:true,
                    isEmailNull:true,
                },
                //发票单位数据
                invoiceUnit:{   
                    invoice:{
                        invoiceHead:'',
                        taxpayerNo:'',
                        elecMobile:'',
                        elecMail:'',
                        realNumber:''                       
                    },
                    headType:'1',
                    isHeadNull:true,
                    isTaxpayerNoNull:true,
                    isMobileNull:true,
                    isEmailNull:true,
                }, 
                invoicePersoneloriginal:{},
                invoiceUnitoriginal:{},
                headType:'',
                invoiceOriginal:[],
                headTypeOriginal:'',
                // 发票变量 结束
                meidouInformatione:false,
                originaltel:'',//原始的发票预留手机号    
                delateForm:{//提交删单请求form 
                    deleteReason:'',
                    name:'',
                },
                delateList:[],//删单原因列表     
            }
        },
        methods: {
            creatfilesClose(done) {//提示去建档弹层关闭时也没刷新
                this.dialogsearchFormVisible = false;
                this.getPageData();
            },
            getPageData() {//获取页面数据
                var _this = this;
                if (this.orderId || this.storeCode) {
                    _this.manageInit();
                } else {
                    // _this.isErrorTxt = true
                }
            },
            manageInit() {//获取页面数据的请求
                var _this = this;
                API.orderdetailsbeforesplit({
                    orderId: this.orderId,
                    storeCode: this.storeCode
                }).then(function(data) {
                    if(data.success && data.response !=null){
                        data.response.shippingGroupList.forEach(function(item){
                            item.showbtn=false;//查看收货人电话
                            item.commerceItemList.forEach(function(prditem){
                                prditem.show=false;

                            });
                        });   
                        //response.orderPromotion.orderGiftInfoList 
                        //订单级赠品信息的查看电话增加变量
                        data.response.orderPromotion.orderGiftInfoList.forEach(function(item){
                            item.showbtn=false;
                        });   
                        //发票信息                        
                        data.response.invoiceInfoList.forEach(function(item){
                            item.show=false;
                        }); 
                        if(data.response.invoiceInfoList.length>0){
                            if(data.response.invoiceInfoList[0].invoiceHeadType==0){//个人
                                _this.invoicePersonel.invoice = data.response.invoiceInfoList[0];
                                _this.headType=0;
                                _this.headTypeOriginal=0;
                                _this.invoiceUnit.invoice={};
                                _this.invoicePersoneloriginal = JSON.parse(JSON.stringify(data.response.invoiceInfoList[0]));
                                _this.invoiceUnitoriginal={};
                            }else{//单位
                                _this.invoiceUnit.invoice = data.response.invoiceInfoList[0];
                                _this.headType=1;
                                _this.headTypeOriginal=1;
                                _this.invoicePersonel.invoice={};
                                _this.invoiceUnitoriginal = JSON.parse(JSON.stringify(data.response.invoiceInfoList[0]));
                                _this.invoicePersoneloriginal={};
                            }; 
                            _this.invoiceOriginal = JSON.parse(JSON.stringify(data.response.invoiceInfoList));
                            _this.originaltel = data.response.invoiceInfoList[0].elecMobile;   
                        };                 
                        _this.response = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
            formatInvoiceMediaType: function (row, column, cellValue) {//发票媒介类型
                if (cellValue === 0){
                    return '不开发票';
                }else if (cellValue === 1){
                    return '纸质发票';
                }else if (cellValue === 2){
                    return '电子发票';
                }
            },
            formatInvoiceHeadType:function(row, column, cellValue){//发票抬头类型  0-个人、1-单位（企业）
                if (cellValue === 0){
                    return '个人';
                }else if (cellValue === 1){
                    return '单位（企业）';
                }
            },
            formatinvoiceBack:function(row, column, cellValue){//发票是否收回  0-未确认收回、1-已确认收回
                if (cellValue === 0){
                    return '未确认收回';
                }else if (cellValue === 1){
                    return '已确认收回';
                }
            },
            lookTelNum:function(itemitem){//查看完整手机号
               // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+itemitem.shippingGroupId)
                API.lookTelNum({
                    commerceItemId:itemitem.commerceItemList[0].commerceItemId,
                }).then(function(data) {   
                    if(data.success && data.response!=null){  
                        itemitem.showbtn =true;
                        itemitem.consigneePhone = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
            lookgiftTelNum:function(itemitem){//查看订单级赠品完整手机号
               // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+itemitem.shippingGroupId)
                API.lookTelNum({
                    commerceItemId:itemitem.giftItemList[0].commerceItemId,
                }).then(function(data) {   
                    if(data.success && data.response!=null){  
                        itemitem.showbtn =true;
                        itemitem.consigneePhone = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
            checkmemberPhone:function(){//查看完整会员手机号
                let _this = this;
                API.memberPhone({
                    storeCode: _this.storeCode,
                    orderId: _this.orderId
                }).then(function(data) { 
                    if(data.success && data.response!=null){
                        _this.response.showbtn = true;
                        _this.response.memberPhone = data.response.phone;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                    
                });
            },
            selectedtype:function(row){//选择机型
                let _this =this;
                _this.dialogsearchFormVisible = true;
                API.queryType({
                    orderNum:_this.orderId,//订单号
                    requestId:_this.response.shippingGroupId,//配送单号
                    daId:_this.response.shippingGroupList[0].commerceItemList[0].address3,//配送区域（三级）
                    daId2:_this.response.shippingGroupList[0].commerceItemList[0].address4,//配送区域（四级）
                    delivery:_this.response.shippingGroupList[0].commerceItemList[0].shippingMethodCode,//配送方式
                    storeCode: _this.response.storeCode,//门店编码
                    salesOrg: _this.response.saleOrg,//销售组织编码
                    lineId: _this.response.shippingGroupList[0].commerceItemList[0].commerceItemId,//行项目ID
                    partNum:_this.response.shippingGroupList[0].commerceItemList[0].skuNo,//商品编码
                    qty: _this.response.shippingGroupList[0].commerceItemList[0].quantity//数量
                }).then(function(data) {   
                    if(data.success){
                        _this.aptList = data.response.skuAptList;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
                
            },
            confirmClick:function(row){//选择机型确认
                let _this =this;
                if(row.qty == 0 && row.abQty == 0){//可卖数为0(在库在途都是0)，提示重新选择
                    this.queryOrderAPTVisible =true;
                }else{//请求可卖数接口，成功后提示去建档
                    commitAPT.commitOrderAPT({
                        daId:_this.response.shippingGroupList[0].commerceItemList[0].address3,//配送区域（三级）
                        daId2:_this.response.shippingGroupList[0].commerceItemList[0].address4,//配送区域（四级）
                        orderNum:_this.orderId,//主订单号
                        requestId:_this.response.shippingGroupId,//配送单号
                        delivery:_this.response.shippingGroupList[0].commerceItemList[0].shippingMethodCode,//配送方式
                        storeCode: _this.response.storeCode,//门店编码
                        salesOrg: _this.response.saleOrg,//销售组织编码
                        lineId: _this.response.shippingGroupList[0].commerceItemList[0].commerceItemId,//行项目ID
                        partNum:_this.response.shippingGroupList[0].commerceItemList[0].skuNo,//商品编码
                        itemType:row.itemType,//业务机型编码
                        supplier:row.supplier,//供应商编码
                        qty: _this.response.shippingGroupList[0].commerceItemList[0].quantity,//数量
                        logicMasLoc:row.logicMasLoc,//逻辑仓编码
                        masLoc:row.masloc,//物理仓编码
                        maslocType:row.maslocType,//仓库类型
                        itemFlag:_this.response.shippingGroupList[0].commerceItemList[0].type,//商品属性
                        poolFlag:row.poolFlag//是否联营（非自然流量NPOP）
                    }).then(function(data) {   
                        if(data.success){
                            _this.creatfilesVisible = true;
                        }else{
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }
                    });
                }
            },
            opencreatfiles:function(){//去建档
                this.creatfilesVisible = false;
               // this.$router.push('/order/creatfilesdetaile/storeCode(门店代码)-orderId(订单号)-commerceItemId(商品唯一号)-shippingGroupId(配送单号)-operFlag(操作标记：0查看 1新增 2修改)');               
                this.$router.push('/order/creatfilesdetaile/'+this.response.storeCode+'-'+this.response.orderId+'-'+this.response.shippingGroupList[0].commerceItemList[0].commerceItemId+'-'+this.response.shippingGroupId+'-1');
            },
            //取消订单
            cancelOrder:function(shippingItem){
                let _this = this;
            // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
                API.cancelOrder({          
                    orderId: this.orderId,//订单号
                    shippingGroupId:this.response.shippingGroupId,//配送单号
                    storeCode: this.storeCode,//销售门店
                    reason:"",//取消原因
                }).then(function(data) {  
                    if(data.success){
                        _this.dialogVisible = false;
                        _this.$message({
                            showClose: true,
                            message: '订单取消成功',
                            type: 'success'
                        });
                        //location.reload();
                        setTimeout(function(){_this.getPageData();},2000)
                        
                        //_this.response.state="已取消";
                        //_this.$router.push({path:'/order/orderindex/'});
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }              
                });
            },
            //订单履历
            handleChange(val) {//订单履历 标题栏点击回调，val 是数组
                let _this =this;
                if(val.length>0){
                    val.forEach(function(element) {
                        if(element==4){
                            _this.queryorder=true;
                        }else{
                            _this.queryorder=false;
                        }
                    }, this);
                }else{
                    _this.queryorder=false;
                }                   
            },
            //立即收款
            payFor() {                    
                API.payment({
                    orderId: this.orderId
                }).then(data => {
                    if (data.success) {
                        if (data.response != null) {
                            this.isPayFor = true;
                            document.getElementById("payFrame").src = data.response;
                        }
                    } else {
                        this.$message({
                        showClose: true,
                        message: data.respMsg,
                        type: "warning"
                        });
                    }
                });
            },
            //修改发票
            changeInvoice(){
                var that=this;
                //获取初始化手机号完整号码，以便当用户不修改手机号的时候直接点击提交
                API.invoiceGetMobile({
                    storeCode: that.storeCode,
                    orderId: that.orderId
                }).then(function(data) { 
                    if(data.success && data.response!=null){
                        that.invoiceUnit.invoice.realNumber = data.response;
                        that.invoicePersonel.invoice.realNumber = data.response;
                    }                   
                });
                that.InvoiceInformatione=true; //打开发票弹层
            },
            //获取发票子组件的数据
            getInvoice(value) {
                var that=this;
                if(value){
                    if(value.headType=='1'){
                        that.invoiceUnit=value;
                    //console.log(that.invoiceUnit)
                    }else{
                        that.invoicePersonel=value;
                    //console.log(that.invoicePersonel)
                    }
                }        
            },
            selectHead(val){//切换单位和个人
                var that=this;
                if(val=='1'){
                    that.headType='1';
                }else{
                    that.headType='0';
                }
            },
            //保存发票
            saveInvoice(formName){                
                var that=this,
                    head='', //参数初始化为空，再根据当前是个人 还是单位 获取对应的参数
                    taxpayerNo='',
                    mobile='',
                    headType='',
                    email='';
                
                //以下四个变量判断各个input有没有报错信息 true表示没有报错，false反之
                var isMobileNull=true,isEmailNull=true,isHeadNull=true,isTaxpayerNoNull=true;
                
                if(that.headType!='1'){//个人
                    if(that.invoicePersonel.invoice.elecMobile == that.originaltel){
                        mobile=that.invoicePersonel.invoice.realNumber;
                    }else{
                        mobile=that.invoicePersonel.invoice.elecMobile;
                    };
                    headType='0';
                    head=that.invoicePersonel.invoice.invoiceHead;
                    taxpayerNo=null; //因为个人发票没有单位税号 给个0的字符串为了让校验通过
                    email=that.invoicePersonel.invoice.elecMail;
                    isHeadNull=that.invoicePersonel.isHeadNull;
                    isTaxpayerNoNull=true;  //同上     
                    isMobileNull=that.invoicePersonel.isMobileNull;
                    isEmailNull=that.invoicePersonel.isEmailNull;
                }else if(that.headType=='1'){
                   // alert('单位')
                    if(that.invoiceUnit.invoice.elecMobile == that.originaltel){
                        mobile=that.invoiceUnit.invoice.realNumber;
                    }else{
                        mobile=that.invoiceUnit.invoice.elecMobile;
                    };
                    head=that.invoiceUnit.invoice.invoiceHead;
                    taxpayerNo=that.invoiceUnit.invoice.taxpayerNo;
                    email=that.invoiceUnit.invoice.elecMail;
                    headType='1';
                    isMobileNull=that.invoiceUnit.isMobileNull;
                    isEmailNull=that.invoiceUnit.isEmailNull;
                    isHeadNull=that.invoiceUnit.isHeadNull;
                    isTaxpayerNoNull=that.invoiceUnit.isTaxpayerNoNull;
                };
               //console.log(isMobileNull,isEmailNull,isHeadNull,isTaxpayerNoNull)
                if(isMobileNull && isEmailNull && isHeadNull && isTaxpayerNoNull){
                    if((headType=='0' && head && mobile) || (headType=='1' && head && taxpayerNo && mobile)){
                        that.InvoiceInformatione = false; //关闭弹层
                        var data={
                        orderId:that.response.orderId,  //订单号
                        shippingGroupId:that.response.shippingGroupId, //配送单号
                        invoiceMediaType:"2", //发票媒介类型
                        invoiceHeadType:headType,   //发票抬头类型
                        invoiceHead:head,   //发票抬头内容
                        taxpayerNo:taxpayerNo, //购方税号
                        elecMobile:mobile, //电子发票预留手机号
                        elecMail:email    //电子发票预留电邮
                        };
                        //报存发票接口
                        API.saveInvoiceToCart(data).then((data) => {
                            if (data.success) {
                                //更新页面发票信息
                                that.$message({
                                    showClose: true,
                                    message: '发票更改成功',
                                    type: 'success'
                                });   
                                that.getPageData();                
                        }else {
                            this.$message({
                            message: data.respMsg,
                            type: 'warning'
                            });
                        }
                        })
                    }else{
                        if(headType!='1'){
                            this.$message({
                            message: "抬头内容/收票手机不能为空",
                            type: 'warning'
                            });
                        }else{
                            this.$message({
                            message: "抬头内容/单位税号/收票手机不能为空",
                            type: 'warning'
                            });
                        }
                    }
                }           
            },
            //点击发票关闭按钮
            close(){
                var _this=this;
                //invoiceOriginal:{},
               // headTypeOriginal:'',
                _this.headType=_this.headTypeOriginal;
                _this.$refs.clear.childMethod(); 
                _this.$refs.clear1.childMethod(); 
                if(_this.headType==0){//个人
                    _this.invoicePersonel.invoice = JSON.parse(JSON.stringify(_this.invoiceOriginal[0]));
                    _this.invoiceUnit.invoice={};
                }else{//单位
                    _this.invoiceUnit.invoice = JSON.parse(JSON.stringify(_this.invoiceOriginal[0]));
                    _this.invoicePersonel.invoice={};
                    
                }; 
                
            },
            //删单原因列表
            delateReasonlist(){
                var that=this;
                that.delateorderVisible = true;
                API.queryDeleteReasonList().then(function(data){
                    if(data.response){
                        that.delateList=data.response;
                    }
                });
            },
            //点击删单确认按钮
            delateFormEvent(){
                var that=this;
                if(this.delateForm.deleteReason==''){
                    this.$message({
                        message: "请选择删单原因",
                        type: 'warning'
                    });
                    return false;
                }else{
                    var params={
                        orderId:that.orderId,//订单号
                        storeCode:that.storeCode,//销售门店
                        reason:this.delateForm.deleteReason//删单原因
                    }
                    API.deleteOrder(params).then(function(data){
                        if(data.success){
                            that.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });  
                            setTimeout(function(){that.getPageData();},2000) 
                        }else{
                            that.$message({
                                message: data.respMsg,
                                type: 'warning'
                            });
                        }
                        that.delateForm.deleteReason='';
                    });
                    that.delateorderVisible = false;
                
                }
                
            },
        },
        mounted() {
            let that = this;
            that.getPageData();
            window.getPayStates = function(val) {
                that.isPayFor = false;
                //val.order_status 00','处理成功''92','取消订单;'93','订单关闭';'94',
                //'订单退款'95';,'订单部分退款';'03','处理中';'90','订单初始化';01','处理失败                
                if (val.order_status == '00') {
                    that.getPageData();
                }
            };
            
           
        },
        filters: {
            formatDate(time) {
                if(time!=null){
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
        watch:{         
            queryorder:function(){
                 let _this =this;
                if(this.queryorder){
                    API.queryOrder({                         
                        storeCode: this.response.storeCode,//销售门店
                        orderId: this.response.orderId,//订单号
                    }).then(function(data) {  
                        if(data.success){
                            _this.response.orderHistoryList = data.response;
                        }else{
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }              
                    });
                }
            }
        },
        computed:{
            ...mapState({//vuex取值
            LOGINDATA:"LOGINDATA"
            })
        },
        components: {
            invoicePersonel,
            invoiceUnit
        }
    }
</script>
<style>
.inline{
    display:inline;
}
.red{
    color:#F56C6C;
}
.mt10{
    margin-top:10px;
}
.fr{
    float:right;
}
.mt20{
    margin-top:20px;
}
.ml40{
    margin-left:40px;
}
.order_detailsbox{
    position: relative;
    min-height:800px;
}
.order_details_l{
    margin-right:320px;
    border:1px solid #E4E7ED;
}
.order_details_r{
    position:fixed; 
    width:300px;
    border:1px solid #E4E7ED;
    right:20px;
    top:20px;
}
.orderinfo,.payinfor,.orderctrolbox{
    width:280px;
    margin:10px auto;
    background:#f2f6fc;
    color:#303133;
    padding:5px 0;
}
.orderctrolbox{
    background:#fff;
    text-align: right;
}
.orderinfo .item{
    width:260px;
    display: flex;
    /* height:30px; */
    line-height:30px;
    padding-left:20px;
}
.orderinfo .item .label{
    /* flex:0 0 100px; */
    text-align:right;
}
.orderinfo .item .info-rcol{
    flex:1;
    text-align:left;
}
.ml10{
    margin-left: 10px;
}
.ml20{
    margin-left: 20px;
    
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
    width:220px;
    display: flex;
    height:24px;
    line-height:24px;
    padding-left:20px;
}
.payinfor .item .label{
    /* flex:0 0 200px; */
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
    font-size: 14px;
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
.dispatching_box .item,.ordercont_box .item{
    line-height:30px;
    display: flex;
    color:#909399;
}
.ordercont_box .item{
    color:#303133;
}
.dispatching_box .item .item_time,.ordercont_box .item .item_time{
    flex:0 0 180px;
    margin-left:50px;
}
.dispatching_box .item .item_cont,.ordercont_box .item .item_cont{
    flex:1;  
}
.commontitle{
    height:35px;
    line-height:35px;
    padding-left:15px;
    background:#EBEEF5;
    color: #303133;
}
.commontitle_1,.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
}
.paymentmesg{
    height: 30px;
    line-height:30px;
    margin-bottom:10px;
}
.paymentmesg1{
    line-height:30px;
    display:flex;
}
.paymentmesg1 .title{
    flex:0 0 100px;
    text-align:right;
}
.ordercont_box{
    border:none;
    padding:10px;
}
.order_line{
    height: 0px;
    overflow: hidden;
    border-bottom:1px solid #909399;
    margin-top:20px;
    margin-bottom:20px;
}
.gifttipsmesg{
    color:#909399;
    margin-bottom:10px;
}
.el-collapse{
    border:none
}
.el-collapse-item__header.focusing:focus:not(:hover){
    color:#fff;
}
.el-collapse-item__content{
    padding-bottom:0;
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

.ellipsis>*:first-child {
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
    background:#f5f7fa;
}
.el-table--border::after, .el-table--group::after{
    width:0;
}
/*修改发票信息*/
.disabledBackground{
  background: #EBEEF5;
  cursor: not-allowed;

}
.disabledBackground .el-checkbox__input{
  cursor: not-allowed;
}
.span-info{
    border-color: hsla(220,4%,58%,.2);
    width: 100px;
    height: 30px;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    border: 1px solid #dcdfe6;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
.div-danger{
    background-color: hsla(0,87%,69%,.1); 
    border-color: hsla(0,87%,69%,.2);
    color: #606266;
    border: 1px solid rgba(64,158,255,.2);
    padding: 15px;
    margin: 0 15px 0 0;
    width: 550px;
    font-size: 13px;
    line-height: 22px;
}
.billInfo{
    font-family: 'Microsoft YaHei';
    font-size:12px;
}
.billInfo .el-form-item{
    margin-bottom:18px;
}
.billInfo .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.billInfo .el-input__inner{
  border-radius: 0;
}
.cuxiao{
   margin:0 20px 0 55px;
   width:420px;
   display: block;
   float: left;
   white-space:nowrap;          /* 不换行 */
   overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
   text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
.self-select-box {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ccc;
    
    text-align: center;
    padding: 0 10px;
    cursor: pointer;
}
.self-select-box .select-icon {
      display: none;
      position: absolute;
      bottom: 0;
      right: 0;
      background: url(../../assets/images/choseIcon.png);
      width: 14px;
      height: 14px;
}
.el-form-item__content .active {
      color: #409EFF;
      border-color: #409EFF;
}
.el-form-item__content .active .select-icon {
    display: block;
}
.el-form-item--small .el-form-item__label,.line32{
    line-height: 32px;
}
</style>




