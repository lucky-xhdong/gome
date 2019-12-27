import Vue from 'vue'
import Router from 'vue-router'
import API from '../api/api_login';
import store from '../store/index';
/*
member
order
service
pcatpview
pcorderview
pcpayview
midesk     
这些都是关键字儿  
1、前端路由 只允许出现一次member、order、service，跟项目匹配
2、后台请求url中不允许出现任何一个关键字  做反向代理了

*/

Vue.use(Router);
// 懒加载方式，当路由被访问的时候才加载对应组件
const creatFiles_select = resolve => require(['@/components/creat-files/creatFiles_select'], resolve);
const creatFiles_detaile = resolve => require(['@/components/creat-files/creatFiles_detaile'], resolve);
const orderindex =resolve => require(['@/components/order-detaile/orderindex'],resolve);
const orderdetails =resolve => require(['@/components/order-detaile/orderdetails'],resolve);
const orderdetailsbeforesplit =resolve => require(['@/components/order-detaile/orderdetails-beforesplit'],resolve);
const orderPurchase_delate =resolve => require(['@/components/order-purchase/orderPurchase_delate'],resolve);
const orderPurchase_detail =resolve => require(['@/components/order-purchase/orderPurchase_detail'],resolve);
const orderPurchase_check =resolve => require(['@/components/order-purchase/orderPurchase_check'],resolve);
const account_unbundle = resolve => require(['@/components/account/account_unbundle'], resolve);
//退换货
const applyService = resolve => require(['@/components/order-service/applyService/applyService'], resolve);
const applyService_list = resolve => require(['@/components/order-service/applyService/applyService_list'], resolve);
const salesReport_list = resolve => require(['@/components/order-service/salesReport/salesReport_list'], resolve);
const salesReport_listNew = resolve => require(['@/components/order-service/salesReport/salesReport_listNew'], resolve);
const promotionFee_list = resolve => require(['@/components/order-service/salesReport/promotionFee_list'], resolve);
const salesOrganization_list = resolve => require(['@/components/order-service/salesReport/salesOrganization_list'], resolve);
const cancelRefuse_list = resolve => require(['@/components/order-service/cancelRefuse/cancelRefuse_list'], resolve);
const cancelDelivery_detail = resolve => require(['@/components/order-service/cancelRefuse/cancelDelivery_detail'], resolve);
const refuseDelivery_detail = resolve => require(['@/components/order-service/cancelRefuse/refuseDelivery_detail'], resolve);
const serviceList_detail = resolve => require(['@/components/order-service/applyService/serviceList_detail'], resolve);
const serviceList_check = resolve => require(['@/components/order-service/applyService/serviceList_check'], resolve);
const insuranceContract =resolve => require(['@/components/order-detaile/insuranceContract'],resolve);
//404  err404
const err404 = resolve => require(['@/components/error/404'], resolve);
const err500 = resolve => require(['@/components/error/500'], resolve);

//联调进度
const demonstration = resolve => require(['@/components/demonstration'], resolve);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/order/demonstration',
      name: 'demonstration',
      component: demonstration
    },
    {
      path: '/order/creatfileselect',
      name: 'creatFiles_select',
      component: creatFiles_select,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/creatfilesdetaile/:initCode?/',
      name: 'creatFiles_detaile',
      component: creatFiles_detaile
    },
    {
      path: '/order/orderindex',
      name: 'orderindex',
      component: orderindex,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/orderdetails',
      name: 'orderdetails',
      component: orderdetails
    },
    {
      path: '/order/orderdetailsbeforesplit',
      name: 'orderdetailsbeforesplit',
      component: orderdetailsbeforesplit
    },
    {
      path: '/order/orderPurchase_delate',
      name: 'orderPurchase_delate',
      component: orderPurchase_delate
    },
    {
      path: '/order/orderPurchase_detail',
      name: 'orderPurchase_detail',
      component: orderPurchase_detail
    },
    {
      path: '/order/orderPurchase_check',
      name: 'orderPurchase_check',
      component: orderPurchase_check
    },
    {
     path: '/order/account/accountUnbundle',
      name: 'account_unbundle',
      component: account_unbundle
    },
    {
      path: '/order/applyService',
      name: 'applyService',
      component: applyService
    },
    {
      path: '/order/applyService_list/:id',//1查看详情页  //2去处理  //3去审核
      name: 'applyService_list',
      component: applyService_list,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/salesReport_list/',//报表
      name: 'salesReport_list',
      component: salesReport_list
    },
    {
      path: '/order/salesReport_listNew/',//报表
      name: 'salesReport_listNew',
      component: salesReport_listNew
    },
    {
      path: '/order/promotionFee_list/',//促销费用表
      name: 'promotionFee_list',
      component: promotionFee_list
    },
    {
      path: '/order/salesOrganization_list/',//销售组织查询报表
      name: 'salesOrganization_list',
      component: salesOrganization_list
    },
    {
      path: '/order/cancelRefuse_list/:id',//取消|拒收
      name: "cancelRefuse_list",
      component: cancelRefuse_list,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/cancelDelivery_detail/:id?',
      name: 'cancelDelivery_detail',
      component: cancelDelivery_detail
    },
    {
      path: '/order/refuseDelivery_detail/:id?',
      name: 'refuseDelivery_detail',
      component: refuseDelivery_detail
    },
    {
      path: '/order/serviceList_detail/:id?',
      name: 'serviceList_detail',
      component: serviceList_detail
    },
    {
      path: '/order/serviceList_check',
      name: 'serviceList_check',
      component: serviceList_check
    },
    {
      path: '/order/500',
      name: 'err500',
      component: err500
    },
    {
      path: '/order/insuranceContract',
      name: 'insuranceContract',
      component: insuranceContract
    },
    {
      path: '/*',
      name: 'err404',
      component: err404
    },
  ]
})
//  登陆接口 在这验证
 router.beforeEach((to, from, next) => {
  if(to.name=="demonstration" || to.name=="err404" || to.name=="err500"){
    next();
    return;
  }
    let url=location.host.replace("mpf","");
    API.login({"url":to.name}).then(function (data) {
    if(data && data.success){
      if(data.response){ //权限赋值
        store.dispatch('setLogin',data.response);
      }
      next();
    }else if(data && !data.success && data.respMsg){ //登录接口异常
      alert('登录接口异常:'+data.respMsg)
    }
  })
 });
 router.afterEach(route => {
  document.getElementById('appLoading').style.display = 'none'; //隐藏loading 
})

export default router
