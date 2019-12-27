
// 关于登陆的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //登录https://easy-mock.com/mock/5ae1685e2d16d45789027d03/orderPurchase_delate
  orderPurchase: params => {
    return API.GET(Env.baseURL+'/5ae1685e2d16d45789027d03/orderpurchase_delate', params)
  }
}
