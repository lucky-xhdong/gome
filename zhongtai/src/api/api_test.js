
import * as API from './'

import Env from './env';
export default {
  //登录
  login: params => {
    return API.GET(Env.baseURL+'/login', params)
  }
}
