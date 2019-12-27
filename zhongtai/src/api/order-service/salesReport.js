import * as API from '../'

import Env from '../env';
export default {
    //1.17 查询用户十大品类列表接口（http）
    getUserMainCategoryList: () => {
        return API.POST(Env.pcorderview + '/queryUserMainCategoryList')
    },
    //13.1 查询销售明细
    querySalesItemList: (params) => {
        return API.POST(Env.pcorderview + '/querySalesItemList', params)
    },
    //13.1 查询销售明细--由大数据提供的新接口，后期会替换原来的querySalesItemList接口
    querySalesItemListNew: (params) => {
        return API.POST(Env.pcorderview + '/querySalesItemListNew', params)
    },
  //导出销售明细
  downSalesItemList: (params) => {//Env.pcorderview + '/exportSalesItemListExcel', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportSalesItemListExcel',
      // responseType:'blob',
      data:params
    })
  },
  //导出销售明细--由大数据提供的新接口，后期会替换原来的downSalesItemList接口
  downSalesItemListNew: (params) => {//Env.pcorderview + '/exportSalesItemListExcelNew', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportSalesItemListExcelNew',
      // responseType:'blob',
      data:params
    })
  },
  //下载销售明细
  saleFileExit: (params) => {
    return API.POST(Env.pcorderview + '/saleFileExit', params)
  },
  //导出促销费明细
  downPromotionFeeList: (params) => {//Env.pcorderview + '/exportSalesItemList', params
    return API.Axios({
      method:'post',
      url:Env.pcorderview + '/exportPromotionFeeList',
      responseType:'blob',
      data:params
    })
  },
  queryBrandList: (params) => {
    return API.POST(Env.pcatpview + '/queryBrandList', params)
  },
  querySupplierList: (params) => {
    return API.POST(Env.pcatpview + '/querySupplierList', params)
  },
  //销售部门级联接口
  queryHierarchy: params => {
    return API.POST(Env.pcorderview + '/queryHierarchy', params)
  },
  //促销费报表
  queryPromotionFeeList: params => {
    return API.POST(Env.pcorderview + '/queryPromotionFeeList', params)
  },

}
