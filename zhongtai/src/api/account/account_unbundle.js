// 手机解绑的请求接口
import * as API from '../index.js'

import Env from '../env';
export default {
	queryBindingEmployeeByAccount:params => {
    return API.POST(Env.pcatpview+'/queryBindingEmployeeByAccount', params)
  },
 
    relieveBinding: params => {
    return API.POST(Env.pcatpview+'/relieveBinding', params)
  }
}
