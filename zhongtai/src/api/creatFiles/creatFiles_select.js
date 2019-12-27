// 建档查询页的请求
import * as API from '../index.js'

import Env from '../env';
export default {
 queryArchiveSelect: params => {
    return API.POST(Env.pcorderview+'/queryArchiveGoodsItemList', params)
  }
}
	
