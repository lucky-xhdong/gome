import * as API from '../'

import Env from '../env';
export default {
    //查询取消待处理列表
    queryCancelDeliveryOrderList: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/querycancelDeliveryOrderList', params)
        return API.POST(Env.pcorderview+'/queryCancelDeliveryOrderList', params)
    },
    //查询拒收待处理列表
    queryRefusedDeliveryOrderList: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/queryRefusedDeliveryOrderList', params)
        return API.POST(Env.pcorderview+'/queryRefusedDeliveryOrderList', params)
    },
    //查询取消处理详情
    queryCancelDeliveryOrderDetail: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/queryCancelDeliveryOrderDetail', params)
        return API.POST(Env.pcorderview+'/queryCancelDeliveryOrderDetail', params)
    },
    //提交取消处理
    commitCancelDeliveryOrder: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/commitCancelDeliveryOrder', params)
        return API.POST(Env.pcorderview+'/commitCancelDeliveryOrder', params)
    },
    //查询拒收处理详情
    queryRefusedDeliveryOrderDetail: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/queryRefusedDeliveryOrderDetail', params)
        return API.POST(Env.pcorderview+'/queryRefusedDeliveryOrderDetail', params)
    },
    //提交拒收处理
    commitRefusedDeliveryOrder: params => {
//        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/commitRefusedDeliveryOrder', params)
        return API.POST(Env.pcorderview+'/commitRefusedDeliveryOrder', params)
    }
}
