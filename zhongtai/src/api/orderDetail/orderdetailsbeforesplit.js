
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
//订单详情页拆单前
export default {
  orderdetailsbeforesplit: params => {
    return API.POST(Env.pcorderview+'/queryUnsplitedOrderDetail', params)
  },
  //订单查看完整手机号
  lookTelNum: params => {
    return API.POST(Env.pcorderview+'/queryFullPhoneNo', params)
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
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryOrder', params)
    return API.POST(Env.pcorderview+'/queryOrderResumeList', params)
  },
  //选择机型
  queryType: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryOrder', params)
    return API.POST(Env.pcorderview+'/queryOrderAPT', params)
  },
  //立即收款  
  payment: params => {
    return API.POST(Env.pcBilling+'/immediatePayment', params)
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/immediatePayment', params)
  },
  //修改发票
  saveInvoiceToCart: params => {
    return API.POST(Env.pcorderview+'/unsplitedOrderUpdateInvioce', params)
  },
  //查询发票预留手机号
  invoiceGetMobile:params => {
    return API.POST(Env.pcorderview+'/unsplitedOrderGetMobile', params)
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/memberPhone', params)
  },
  //删除导购单原因列表
  queryDeleteReasonList: params => {
    return API.POST(Env.pcorderview+'/queryDeleteReasonList', params)
  },
  //http://pcorderview.atguat.com.cn/deleteOrder
  //删除订单
  deleteOrder: params => {
    return API.POST(Env.pcorderview+'/deleteOrder', params)
  }
}