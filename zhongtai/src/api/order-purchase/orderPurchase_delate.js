// 关于登陆的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //http://pcorderview.atguat.com.cn/queryUnpaidOrderList
  //查询可删除订单列表
  queryUnpaidOrderList: params => {
    return API.POST(Env.pcorderview+'/queryUnpaidOrderList', params)
  },
  //http://pcorderview.atguat.com.cn/queryMemberInfo
  //会员卡号或手机号
  cardNumber: params => {
    return API.POST(Env.pcorderview+'/queryMemberInfo', params)
  },
   //http://pcorderview.atguat.com.cn/queryEmployeeInfoByAccount
  //导购员编号
  queryEmployeeInfoByAccount: params => {
    return API.POST(Env.pcorderview+'/queryEmployeeInfoByAccount', params)
  },
 // http://pcatpview.atguat.com.cn/querySkuList
  //弹框里面的高级商品查询
  querySkuList: params => {
    return API.POST(Env.pcatpview+'/querySkuList', params)
  },
  //商品编号 点击回车商品查询
  querySkuInfo: params => {
      return API.POST(Env.pcorderview+'/querySkuInfo', params)
  },
 //	http://pcorderview.atguat.com.cn/queryDeleteReasonList	
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


