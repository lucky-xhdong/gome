
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
//https://easy-mock.com/mock/5addabc90ab25a3530febe1b/orderindex/queryOrderList
export default {
  //订单列表页
  queryOrderList: params => {
    return API.POST(Env.pcorderview+'/queryOrderList', params)
  },
  //会员卡号或手机号
  orderMemberInfo: params => {
    return API.POST(Env.pcorderview+'/queryMemberInfo', params)
  },
  //导购员编号
  ordersellerInfo: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/ordersellerInfo', params)
    //http://pcorderview.atguat.com.cn/queryEmployeeInfoByAccount
    return API.POST(Env.pcorderview+'/queryEmployeeInfoByAccount', params)
  },
  //订单状态
  queryOrderStateList: params => {
    return API.POST(Env.pcorderview+'/queryOrderStateList', params)
  }
}