
// 关于登陆的接口

import * as API from './'

import Env from './env';
export default {
  //登录
  demonstrationinfo: params => {
    return API.GET(Env.baseURL+'/5aceb8caea0ca732e6dc1edf/platform/demonstrationinfo', params)
  }
}
