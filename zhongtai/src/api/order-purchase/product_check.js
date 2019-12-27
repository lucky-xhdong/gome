// 关于登陆的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  
    product_check: params => {
    return API.GET(Env.baseURL+'/5ae42cd52bfb1a7e1d60f697/product_check', params)
  }
}
