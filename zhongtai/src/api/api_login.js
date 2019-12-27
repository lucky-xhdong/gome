
// 关于登陆的接口

import * as API from './'

import Env from './env';
export default {

  //登录
  login: params => {

    return API.POST(Env.pcatpview+'/queryUserAuthorityList', params)
  }
}
