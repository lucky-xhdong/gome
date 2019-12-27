// 建档详情页的请求接口
import * as API from '../index.js'

import Env from '../env';
export default {
 
    queryGoodsItemArchive: params => {
    return API.POST(Env.pcorderview+'/queryGoodsItemArchive', params)
  },
  saveGoodsItemArchive: params => {
    return API.POST(Env.pcorderview+'/saveGoodsItemArchive', params)
  }
  //http://pcorderview.atguat.com.cn/queryGoodsItemArchive

}
