
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
//提交订单预留可卖数
export default {
  commitOrderAPT: params => {
    return API.POST(Env.pcorderview+'/commitOrderAPT', params)
  },
}