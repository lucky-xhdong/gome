import * as API from '../'

import Env from '../env';
export default {
    //        http://pcorderview.atguat.com.cn/submitReturnRequestExpressInfo
    //退换货列表查询初始化
    getReturnRequestInitList: params => {
        return API.POST(Env.pcorderview + '/getReturnRequestInitList', params)
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/getReturnRequestInitList', params)
    },
    //点击查询按钮查询服务单列表
    getReturnRequestList: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/getReturnRequestList', params)
        return API.POST(Env.pcorderview + '/getReturnRequestList', params)
    },
    //退换货提交页面初始化
    getStoreReturnInit: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/getStoreReturnInit', params)
        return API.POST(Env.pcorderview + '/getStoreReturnInit', params)
    },
    //退换货提交界面保存
    submitReturnRequest: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/submitReturnRequest', params)
        return API.POST(Env.pcorderview + '/submitReturnRequest', params)
    },
    //退换货处理页面初始化
    showNewReturnRequest: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/showNewReturnRequest', params)
        return API.POST(Env.pcorderview + '/showNewReturnRequest', params)
    },
    //退换货上传图片
    uploadImage: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/uploadImage', params)
        return API.POST(Env.pcorderview + '/uploadImage', params)
    },
    //退换货处理页面保存
    dealReturnRequest: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/dealReturnRequest', params)
        return API.POST(Env.pcorderview + '/dealReturnRequest', params)
    },
    //查询退换货详情页
    queryReturnRequestDetailInfo: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/queryReturnRequestDetailInfo', params)
        return API.POST(Env.pcorderview + '/queryReturnRequestDetailInfo', params)
    },
    //查询快递公司列表
    queryExpressCompanyList: params => {
        //        http://pcorderview.atguat.com.cn/queryExpressCompanyList
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/queryExpressCompanyList', params)
        return API.POST(Env.pcorderview + '/queryExpressCompanyList', params)
    },
    //提交补充物流信息
    submitReturnRequestExpressInfo: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/submitReturnRequestExpressInfo', params)
        return API.POST(Env.pcorderview + '/submitReturnRequestExpressInfo', params)
    },
    //提交退换货审核
    submitReturnRequestAuditInfo: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/submiReturnRequestAuditInfo', params)
        return API.POST(Env.pcorderview + '/submitReturnRequestAuditInfo', params)
    },
    //退换货申请页动态查询退换货方式列表
    dynamicQueryReturnMethod: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/dynamicQueryReturnMethod', params)
        return API.POST(Env.pcorderview + '/dynamicQueryReturnMethod', params)
    },
    //查看手机号
    queryFullPhoneNo: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/dynamicQueryReturnMethod', params)
        return API.POST(Env.pcorderview + '/queryFullPhoneNo', params)
    },
    //查询退货详情完整手机号接口
    queryRefundFullPhoneNo: params => {
        //        return API.POST(Env.baseURL+'/5addd95c780c995b91b2e655/example/dynamicQueryReturnMethod', params)
        return API.POST(Env.pcorderview + '/queryRefundFullPhoneNo', params)
    },
    //导购员编号
    queryEmployeeInfoByAccount: params => {
        return API.POST(Env.pcorderview + '/queryEmployeeInfoByAccount', params)
    },
    //取消申请退换货
    cancelReturnRequest: params => {
        return API.POST(Env.pcorderview + '/cancelReturnRequest', params)
    }
}
