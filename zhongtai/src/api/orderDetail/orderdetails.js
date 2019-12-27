
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
export default {
  //订单详情页
  orderdetails: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/orderdetails', params)
    return API.POST(Env.pcorderview+'/querySplitedOrderDetail', params)
  },
  //订单查看完整手机号
  lookTelNum: params => {
    return API.POST(Env.pcorderview+'/queryFullPhoneNo', params)
  },
  //查询配送履历
  orderShippingResume: params => {
    return API.POST(Env.pcorderview+'/queryShippingResumeList', params)
  },
  //查询安装履历
  orderInstallResume: params => {
    return API.POST(Env.pcorderview+'/queryInstallResumeList', params)
  },
  //订单查看完整会员手机号
  memberPhone: params => {
    return API.POST(Env.pcorderview+'/queryDetailPageMemberPhone', params)
  },
  //取消订单
  cancelOrder: params => {
    return API.POST(Env.pcorderview+'/cancelOrder', params)
  },
  //订单履历
  queryOrder: params => {
    return API.POST(Env.pcorderview+'/queryOrderResumeList', params)
  },
  //正向关联退换货列表
  queryreturninfo: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryreturninfo', params)
    return API.POST(Env.pcorderview+'/queryReturnList', params)
  },
  //发送提货码短信
  sendMessage: params => {
    return API.POST(Env.pcorderview+'/sendShippingVerifyCodeMessage', params)
  },
  //查看自提码或签收码(因为临时卡和会员卡的权限不一样，将同一个方法写成两个接口，实现同样的功能，不能erm捕捉不到)
  viewCoding:params => {
    return API.POST(Env.pcorderview+'/queryShippingVerifyCode', params)
  },
  viewCodingMember:params => {
    return API.POST(Env.pcorderview+'/queryShippingVerifyCodeMember', params)
  },
  //查询购买补够延保
  buyYanbao:params => {
    //https://www.easy-mock.com/mock/5addabc90ab25a3530febe1b/orderindex/queryIncrementServiceDetail
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryIncrementServiceDetail', params)
    return API.POST(Env.pcBilling+'/queryIncrementServiceDetail', params)
  },
  //提交购买补够延保
  AddSellerBill:params => {
    return API.POST(Env.pcBilling+'/initValueAddSellerBill', params)
  },
  //发送延保协议
  sendInsurance:params => {
    return API.POST(Env.pcorderview+'/sendWarrantyAgreement', params)
  },
  //查询延保协议
  cheackInsurance:params => {
    return API.POST(Env.pcorderview+'/getWarrantAgreement', params)
  },
  //拒收
  rejectionOrder:params => {
    return API.POST(Env.pcorderview+'/reject', params)
  },
  //确认收货
  confirmOrder:params => {
    return API.POST(Env.pcorderview+'/confirm', params)
  },
}