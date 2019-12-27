<template>
  <el-container class="salesReport_list">
    <el-form class="sr-list__form"
             ref="sr-list__form"
             :rules="rules"
             :inline="true"
             :model="form"
             size="mini"
             @submit.native.prevent
             data-before="查询条件">
      <!--表单查询 start-->
      <!--销售部门 start-->
      <commonSalesReportTree @getSaleDepartmentsId="getSaleDepartmentsId" ref="salesReportTree"></commonSalesReportTree>
      <!--销售部门 end-->

      <el-row class="input-group">
        <!-- <el-form-item label="所属分部：">
            <el-select v-model="form.department" placeholder="请选择">
                <el-option value="所属分部"></el-option>
            </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="所属门店：">
            <el-select v-model="form.store" placeholder="请选择">
                <el-option value="所属门店"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="事业部门名称：">
          <el-select v-model="form.kinds" placeholder="请选择">
            <el-option v-for="(item, index) in config.kinds"
                       :label="item.label" :value="item.value"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌编码：">
          <el-input style="width:200px" placeholder="请输入品牌编码" v-model="form.brand"></el-input>
          <el-button type="text" @click="showDialog('dialogGetBrandCode')">查看品牌编码</el-button>
        </el-form-item>

        <el-form-item label="商品编码：">
          <el-input placeholder="请输入商品编码" v-model="form.skuNo"></el-input>
        </el-form-item>
        <el-form-item label="零售单状态：">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="(item, index) in config.status"
                       :label="item.label" :value="item.value"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="form.times"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="config.pickerStart"
            :default-value="config.times"
            @change="changeTimes"
            style="width: 290px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="供应商编码：">
          <el-input style="width:188px" placeholder="请输入供应商编码" v-model="form.supplierCode"></el-input>
          <el-button type="text" @click="showDialog('dialogGetSupplierCode')">查看供应商编码</el-button>
        </el-form-item>
        <el-form-item label="渠道：">
          <el-select v-model="form.salesChannel" placeholder="请选择">
            <el-option v-for="(item,index) in config.channel"
                       :label="item.label" :value="item.value"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="促销员编码：">
          <el-input placeholder="请输入促销员编码" v-model="form.sellerCode"></el-input>
        </el-form-item>
        <el-form-item label="配送单号：">
          <el-input placeholder="请输入配送单号" v-model="form.deliveryId"></el-input>
        </el-form-item>
      </el-row>
      <el-row class="btn-group">
        <el-form-item>
          <el-button @click="resetForm()">重置</el-button>
          <el-button type="primary" native-type="submit" :loading="loading" @click="queryReturnRequestList()">查询
          </el-button>
        </el-form-item>
      </el-row>
      <!--表单查询 end-->

      <!--查询品牌编码弹窗 start-->
      <el-dialog title="查询品牌编码" :visible.sync="dialogGetBrandCode">
        <el-form :model="formBrand" ref="formBrand" :rules="rulesFormBrand" size="mini" @submit.native.prevent>
          <el-form-item label="品牌编码或名称" prop="brandCodeOrName">
            <el-input v-model="formBrand.brandCodeOrName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" native-type="submit"
                       :loading="formBrand.loading"
                       @click="getBrandCodeLists('formBrand')">查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-table :data="BrandCodeLists" v-loading="formBrand.loading" @row-click="checkedFormBrand">
          <el-table-column property="brandCode" label="品牌编码" width="200"></el-table-column>
          <el-table-column property="brandName" label="品牌" width="200"></el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeByBrandCode"
          background
          :current-page=formBrand.page.currentPage
          :page-size=formBrand.page.pageSize
          v-if="formBrand.page.totalPage>1"
          layout="total, prev, pager, next"
          :total=formBrand.page.totalPage>
        </el-pagination>
      </el-dialog>
      <!--查询品牌编码弹窗 end-->

      <!--查询供应商编码弹窗 start-->
      <el-dialog title="查询供应商编码" :visible.sync="dialogGetSupplierCode">
        <el-form :model="formBrand" ref="formBrand" :rules="rulesFormBrand" size="mini" @submit.native.prevent>
          <el-form-item label="供应商编码或名称" prop="brandCodeOrName">
            <el-input v-model="formBrand.brandCodeOrName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" native-type="submit"
                       :loading="formBrand.loading"
                       @click="getBrandCodeLists('formBrand')">查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-table :data="BrandCodeLists" v-loading="formBrand.loading" @row-click="checkedFormSupplier">
          <el-table-column property="supplierCode" label="供应商编码" width="200"></el-table-column>
          <el-table-column property="supplierName" label="供应商" width="200"></el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeByBrandCode"
          background
          :current-page=formBrand.page.currentPage
          :page-size=formBrand.page.pageSize
          v-if="formBrand.page.totalPage>1"
          layout="total, prev, pager, next"
          :total=formBrand.page.totalPage>
        </el-pagination>
      </el-dialog>
      <!--查询供应商编码弹窗 end-->
    </el-form>
    <!--销售统计 start-->
    <el-row class="sr-total-wrapper">
      <el-row class="sales-time">
        <span data-before="销售统计：" class="txt">{{show.showTime.start}}-{{show.showTime.end}}</span>
        <span v-if="dataSalesItemList && dataSalesItemList.length > 0">
        <el-button v-if="LOGINDATA.salesReport_list_down1" size="mini" @click="handleExport()" title="只能导出30天内数据">导出</el-button>
        <a size="mini" href="javascript:void(0)" class="btn-download" v-show="showDownloadLink" @click="handleDownload">下载</a>
        </span>
        <commonSalesReportColumnSetting :dataSalesItemList="dataSalesItemList" :configItmesAll="configItmesAll"></commonSalesReportColumnSetting>
      </el-row>
      <el-row class="sales-money">
        <span data-before="销售额：" class="txt">{{show.totalSalesAmount | amountPennyToWan}}万元</span>
        <span data-before="实付额：" class="txt ">{{show.totalPayAmount | amountPennyToWan}}万元</span>
        <span data-before="销售量：" class="txt">{{show.totalSalesQty}}台</span>
      </el-row>
    </el-row>
    <el-row v-show="showProgerssBar">
      <el-progress class="sr-progress" :text-inside="true" :percentage="percentage"></el-progress>
    </el-row>
    <!--销售统计 end-->

    <!--数据表 start-->
    <div class="common-table common-table-01">
      <el-table :data="dataSalesItemList"
                v-loading="loading"
                height="500">
        <el-table-column
          v-for="(item) in configItmesAll"
          :key="item.id"
          :type=item.type
          :prop=item.prop
          :label=item.label
          :min-width=item.width
          v-if="item.className == 'show'">
          <!--v-if="item.className == 'show'"-->
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <span v-if=" scope.row.salesChannel==16">
                <router-link tag="a" target="_blank" class="btn-normal"
                             :to="{ path:'/order/orderdetails', query:{ orderId: scope.row.orderId, storeCode: scope.row.storeCode }}"
                >操作</router-link>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page=page.currentPage
        :page-size=page.pageSize
        v-if="page.totalPage>1"
        layout="total, prev, pager, next"
        :total=page.totalPage>
      </el-pagination>
    </div>
    <!--数据表 end-->
  </el-container>

</template>
<style lang="scss">
  @import "@/assets/styles/order-service/variable.scss";
  @import "@/assets/styles/order-service/salesReport_list.scss";
  @import "@/assets/styles/order-service/common.scss";
</style>
<script>
  import {mapState} from "vuex";
  import API from "@/api/order-service/salesReport";
  import commonSalesReportTree from "@/components/order-service/common/commonSalesReportTree";
  import commonSalesReportColumnSetting from '@/components/order-service/common/commonSalesReportColumnSetting'
  import Env from '@/api/env'

  /**
   * 对日期处理
   * return type1 请求参数格式
   *        type2 展示格式
   */
  function getParseTime(times) {
    if (!times) {
      return {
        type1: {
          start: "",
          end: ""
        },
        type2: {
          start: "",
          end: ""
        }
      };
    }
    let start = new Date(times[0]),
      end = new Date(times[1]);

    function _formatByGe(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    }

    function format(date) {
      return (
        date.getFullYear() +
        "-" +
        _formatByGe(date.getMonth() + 1) +
        "-" +
        _formatByGe(date.getDate())
      );
    }

    function format2(date) {
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日"
      );
    }

    return {
      type1: {
        start: format(start),
        end: format(end)
      },
      type2: {
        start: format2(start),
        end: format2(end)
      }
    };
  }

  /**
   * 查询接口参数与下载参数
   */
  function getRequestPararQuery(content) {
    const times = getParseTime(content.form.times).type1;
    return {
      currentStoreCode: content.form.userId, //登录门店id
      mainCategoryCode: content.form.kinds == "-1" ? "" : content.form.kinds, //
      brandCode: content.form.brand, //
      skuNo: content.form.skuNo, //
      orderType: content.form.status, //
      salesChannel:
        content.form.salesChannel === 0 ? "" : content.form.salesChannel, //渠道
      supplierCode: content.form.supplierCode, //供应商编码
      storeCodes: content.form.storeCodes, //门店id
      deliveryId: content.form.deliveryId, //配送单号
      sellerCode: content.form.sellerCode, //促销员编码
      // regioneIds: content.form.regioneIds, //大区ID列表
      // branchId1s: content.form.branchId1s, //一级分部ID列表
      // branchId2s: content.form.branchId2s, //二级分部ID列表
      currentPage: content.page.currentPage, //
      pageSize: content.page.pageSize,
      beginTime: times.start,
      endTime: times.end
    }
  }

  export default {
    data() {
      return {
        loading: false,
        header: {
          content: "查询条件" // tit名字
        },
        dialogGetBrandCode: false,
        dialogGetSupplierCode: false,
        show: {
          showTime: {start: "", end: ""},
          totalSalesAmount: "--", //销售金额总计
          totalSalesQty: "--", //销售数量总计
          totalPayAmount: "--"
        },
        page: {
          currentPage: 1,
          pageSize: 10,
          totalPage: 1
        },
        form: {
          userId: '',//登录门店id
          department: "", //部门
          store: "", //门店
          kinds: "", //种类
          brand: "", //品牌
          skuNo: "", //型号
          status: "", //状态
          salesChannel: "", //销售渠道
          supplierCode: "", //供货商代码
          storeCodes: [], //门店代码
          times: [],
          sellerCode: '',//促销员编码
          deliveryId: ''//配送单号
        },

        formBrand: {},
        rulesFormBrand: {
          brandCodeOrName: [
            {required: true, message: "请输入", trigger: "blur"}
          ]
        },
        BrandCodeLists: [],
        percentage: 0,
        showProgerssBar: false,

        config: {
          status: [
            {value: 0, label: "全部"},
            {value: 1, label: "支付"},
            {value: 2, label: "取消"}
          ],
          kinds: [], //品类
          pickerStart: {
            disabledDate: time => {
              return time.getTime() < new Date("2018-06-23").getTime();
            }
          },
          channel: [
            {value: 0, label: "全部"},
            {value: 16, label: "来购"},
            {value: 13, label: "美店分享"},
            {value: 10, label: "金力零售"},
            {value: 20, label: "金力对公"}
          ], //渠道
          _channel: {},
          times: [new Date(), new Date()]
        },
        configItmesAll: [
          {label: "分部代码", prop: "salesOrgCode", className: 'hide', width: 100, disabled: false},
          {label: "分部名称", prop: "salesOrgName", className: 'show', width: 150, disabled: false},
          {label: "销售门店代码", prop: "storeCode", className: 'hide', width: 120, disabled: false},
          {label: "销售门店", prop: "storeName", className: 'show', width: 150, disabled: false},
          {label: "事业部门代码", prop: "mainCategoryCode", className: 'hide', width: 120, disabled: false},
          {label: "事业部门名称", prop: "mainCategoryName", className: 'show', width: 120, disabled: false},//原十大品类
          {label: "品类代码", prop: "categoryCode", className: 'hide', width: 100, disabled: false},
          {label: "品类名称", prop: "categoryName", className: 'show', width: 100, disabled: false},//四级品类
          {label: "品牌代码", prop: "brandCode", className: 'hide', width: 100, disabled: false},
          {label: "品牌名称", prop: "brandName", className: 'show', width: 100, disabled: false},
          {label: "业务机型代码", prop: "bizType", className: 'hide', width: 120, disabled: false},
          {label: "业务机型名称", prop: "bizTypeName", className: 'hide', width: 120, disabled: false},
          {label: "商品编码", prop: "skuNo", className: 'show', width: 100, disabled: false},
          {label: "商品名称", prop: "skuName", className: 'show', width: 250, disabled: true},
          {label: "销售数量", prop: "salesQty", className: 'show', width: 80, disabled: false},
          {label: "商品原价", prop: "_retailPrice", className: 'hide', width: 80, disabled: false},
          {label: "订单金额", prop: "_salesAmount", className: 'show', width: 80, disabled: false},
          {label: "实收金额", prop: "_payAmount", className: 'show', width: 80, disabled: false},
          {label: "促销金额", prop: "_amount", className: 'show', width: 200, disabled: false},
          {label: "店长券", prop: "_dianZhang", className: 'show', width: 80, disabled: false},
          {label: "赠豆", prop: "_zengDou", className: 'show', width: 120, disabled: false},//(合计美豆)
          {label: "订单号", prop: "orderId", className: 'hide', width: 120, disabled: false},
          {label: "配送单号", prop: "deliveryId", className: 'show', width: 120, disabled: false},
          {label: "退货原单号", prop: "refundOrderId", className: 'hide', width: 120, disabled: false},
          {label: "原配送单号", prop: "originDeliveryId", className: 'hide', width: 120, disabled: false},
          {label: "配送单状态", prop: "orderTypeName", className: 'show', width: 120, disabled: false},
          {label: "销售时间", prop: "salesTime", className: 'show', width: 160, disabled: false},
          {label: "记账日期", prop: "accountDate", className: 'hide', width: 150, disabled: false},
          {label: "渠道", prop: "_salesChannel", className: 'show', width: 100, disabled: false},
          {label: "促销员编码", prop: "sellerCode", className: 'show', width: 120, disabled: false},
          {label: "促销员", prop: "sellerName", className: 'show', width: 100, disabled: false},
          {label: "集客员工编号", prop: "jikeShareId", className: 'hide', width: 120, disabled: false},
          {label: "集客员工姓名", prop: "jikeShareName", className: 'hide', width: 120, disabled: false},
          {label: "集客活动ID", prop: "jikeActiveId", className: 'hide', width: 100, disabled: false},
          {label: "集客券号", prop: "jikeTicketId", className: 'hide', width: 100, disabled: false},
          {label: "入场券号", prop: "_ticketNum", className: 'show', width: 120, disabled: false},
          {label: "对公客户编号", prop: "customerNum", className: 'hide', width: 120, disabled: false},
          {label: "客户名称", prop: "customerName", className: 'show', width: 200, disabled: false},
          {label: "会员手机号", prop: "customerPhone", className: 'show', width: 120, disabled: false},
          {label: "会员电话", prop: "customerTelPhone", className: 'hide', width: 100, disabled: false},
          {label: "会员编号", prop: "memberNum", className: 'hide', width: 120, disabled: false},
          {label: "会员卡类型", prop: "memberCardType", className: 'hide', width: 120, disabled: false},
          {label: "会员卡类型名称", prop: "memberTypeName", className: 'hide', width: 150, disabled: false},
          {label: "会员卡号", prop: "memberCardNum", className: 'hide', width: 140, disabled: false},
          {label: "会员姓名", prop: "memberName", className: 'hide', width: 140, disabled: false},
          {label: "会员地址", prop: "customerAddress", className: 'hide', width: 200, disabled: false},
          {label: "临时卡标记", prop: "_temporaryCardMark", className: 'hide', width: 150, disabled: false},
          {label: "联营标记", prop: "_unionFlag", className: 'hide', width: 100, disabled: false},
          {label: "收货人姓名", prop: "consignee", className: 'show', width: 120, disabled: false},
          {label: "收货人手机号", prop: "consigneePhone", className: 'show', width: 150, disabled: false},
          {label: "收货人地址", prop: "consigneeAddress", className: 'show', width: 200, disabled: false},
          {label: "供应商代码", prop: "supplierCode", className: 'hide', width: 120, disabled: false},
          {label: "供应商名称", prop: "supplierName", className: 'show', width: 150, disabled: false},
          {label: "预约送货日期", prop: "deliveryDate", className: 'hide', width: 150, disabled: false},
          {label: "预约安装日期", prop: "installDate", className: 'hide', width: 150, disabled: false},
          {label: "发货人代码", prop: "shipperCode", className: 'hide', width: 120, disabled: false},
          {label: "发货人", prop: "shipper", className: 'hide', width: 120, disabled: false},
          {label: "发货日期", prop: "shipDate", className: 'show', width: 120, disabled: false},
          {label: "仓库代码", prop: "warehouseCode", className: 'hide', width: 100, disabled: false},
          {label: "仓库名称", prop: "warehouseName", className: 'hide', width: 150, disabled: false},
          {label: "仓库状态", prop: "_storageType", className: 'hide', width: 100, disabled: false},
          {label: "仓库所属公司代码", prop: "warehouseCompanyCode", className: 'hide', width: 160, disabled: false},
          {label: "仓库所属公司名称", prop: "warehouseCompany", className: 'hide', width: 160, disabled: false},//
          {label: "赠品标记", prop: "presentFlag", className: 'hide', width: 100, disabled: false},
          {label: "延保商品/赠品对应主品配送单号", prop: "warrantyMainDeliveryId", className: 'hide', width: 250, disabled: false},
          {label: "商品类型", prop: "_productType", className: 'hide', width: 100, disabled: false},
          {label: "发票类型", prop: "_envoiceType", className: 'hide', width: 100, disabled: false},
          {label: "发票号", prop: "envoiceNum", className: 'hide', width: 150, disabled: false},
          {label: "发票代码", prop: "envoiceCode", className: 'hide', width: 120, disabled: false},
          {label: "发票开票日期", prop: "envoiceDate", className: 'hide', width: 200, disabled: false},
          {label: "发票内容", prop: "envoiceNote", className: 'hide', width: 120, disabled: false},
          {label: "备注", prop: "note", className: 'show', width: 200, disabled: false},
          {label: "串码标记/信息", prop: "_serialCodeMark", className: 'hide', width: 150, disabled: false},
          {label: "样机机器码", prop: "prototypeMachineCode", className: 'hide', width: 120, disabled: false},
          {label: "协议合同号", prop: "contractNumber", className: 'hide', width: 120, disabled: false},
          {label: "协议号", prop: "protocolNumber", className: 'hide', width: 120, disabled: false},
          {label: "协议策略编号", prop: "policyNumber", className: 'hide', width: 150, disabled: false},
          {label: "赠品政策组合编号", prop: "giftNum", className: 'hide', width: 160, disabled: false},
          {label: "促销积分政策编码", prop: "promotionNum", className: 'hide', width: 160, disabled: false},
          {label: "促销单号", prop: "promotionCode", className: 'hide', width: 120, disabled: false},
          {label: "赠品退单号", prop: "giftRefund", className: 'hide', width: 120, disabled: false},
          {label: "退赠原因", prop: "causeRefund", className: 'hide', width: 120, disabled: false},
          {label: "退赠付款方式", prop: "refundPayment", className: 'hide', width: 150, disabled: false},
          {label: "退货数量", prop: "refundNum", className: 'hide', width: 80, disabled: false},
          {label: "退货转销售标记", prop: "returnSalesMark", className: 'hide', width: 120, disabled: false},
          {label: "退换货转换人", prop: "replacementPerson", className: 'hide', width: 120, disabled: false},
          {label: "退换货转换类型", prop: "conversionType", className: 'hide', width: 150, disabled: false},
          {label: "退换货转换原因", prop: "conversionCause", className: 'hide', width: 150, disabled: false},
          {label: "异型号换货转销售标记", prop: "differentMark", className: 'hide', width: 200, disabled: false},
          {label: "收银台", prop: "syt", className: 'hide', width: 100, disabled: false},
          {label: "收银员代码", prop: "cashierCode", className: 'hide', width: 120, disabled: false},
          {label: "收银员", prop: "cashier", className: 'hide', width: 120, disabled: false},
          {label: "登录人代码", prop: "loginCode", className: 'hide', width: 120, disabled: false},
          {label: "登录人名称", prop: "loginName", className: 'hide', width: 120, disabled: false},
          {label: "欠款金额", prop: "_amountMoney", className: 'hide', width: 80, disabled: false},
          {label: "还款金额", prop: "_repayment", className: 'hide', width: 80, disabled: false},
          {label: "资金收取门店", prop: "chargeStore", className: 'hide', width: 120, disabled: false},
          {label: "资金收取门店代码", prop: "chargeStoreCode", className: 'hide', width: 160, disabled: false},
          {label: "支票销售单号", prop: "salesNumber", className: 'hide', width: 150, disabled: false},
          {label: "支票锁定标记", prop: "_lockMark", className: 'hide', width: 150, disabled: false},
        ],
        dataSalesItemList: [],
        rules: {},
        treeItems: [],
        checkedTreeItems: [],
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        showDownloadLink: false,
        cookieDomain: '',

      };
    },
    filters: {
      amountPennyToWan: function (value) {
        if (value == 0) return "0.00";
        if (!value || isNaN(value)) return "--";
        return value / 1000000;
      }
    },
    created() {
      this.__getConfigKinds();
      this.init();
    },
    //vuex取值
    computed: mapState({
      LOGINDATA: "LOGINDATA"
    }),
    components: {
      commonSalesReportTree,
      commonSalesReportColumnSetting
    },
    mounted() {
    },
    methods: {
      init() {
        let _this = this;
        this.config.channel.forEach((item) => {
          this.config._channel[item.value] = item.label
        });
        this.form.times = [new Date(), new Date()];
        (this.form.brand = ""), (this.form.skuNo = ""), (this.form.kinds = -1); //默认是全选
        this.form.status = 0;
        this.form.supplierCode = "";
        this.form.salesChannel = 0;
        this.form.storeCodes = [];
        this.form.sellerCode = "";
        this.form.deliveryId = "";
        //重置操作需要清空分部列表和部门树勾选状态，因为通过获取dom元素来更新数据，所以放在this.$nextTick()中
        this.$nextTick(() => {
          _this.$refs.salesReportTree.checkedTreeItems = [];
          _this.$refs.salesReportTree.setCheckedKeys();
        });
        this.__queryReturnRequestList();
        this._initFormBrand();
      },

      //品牌信息
      _initFormBrand() {
        this.formBrand.brandCodeOrName = "";
        this.formBrand.loading = false;
        this.formBrand.page = {
          currentPage: 1,
          pageSize: 10,
          totalPage: 1
        };
      },

      //品类
      __getConfigKinds() {
        const _this = this;
        API.getUserMainCategoryList().then(
          response => {
            if (response.success) {
              if (response.response && response.response.length > 0) {
                _this.config.kinds = response.response.map((current, index) => {
                  return {
                    value: current.code,
                    label: current.name
                  };
                });
                _this.config.kinds.unshift({
                  value: -1,
                  label: "全部"
                });
              } else {
                _this.config.kinds = [];
              }
            } else {
              _this.config.kinds = [];
              if (response.respMsg) {
                _this.$message.error(response.respMsg);
              }
            }
          },
          reject => {
            console.error(reject);
          }
        );
      },

      //查询报表信息
      queryReturnRequestList() {
        this.page.currentPage = 1;
        this.__queryReturnRequestList();
      },

      //查询报表信息
      __queryReturnRequestList() {
        const times = getParseTime(this.form.times).type1;
        this.show.showTime = getParseTime(this.form.times).type2;
        const requestPara = getRequestPararQuery(this);
        const _this = this;

        function __errorhandle(response) {
          //    _this.config.kinds = [];
          _this.page.currentPage = 1;
          _this.loading = false;
          _this.show.totalSalesQty = "--";
          if (response.respMsg) {
            _this.$message.error("接口querySalesItemList：" + response.respMsg);
          }
        }

        _this.loading = true;
        API.querySalesItemList(requestPara).then(
          response => {
            _this.loading = false;
            _this.showDownloadLink = false;
            if (response.success) {
              if (response.response) {
                const _res = response.response;
                //处理返回数据
                //处理分页数据
                _this.page = {
                  currentPage: _res.pager.currentPage,
                  pageSize: _res.pager.pageSize,
                  totalPage: _res.pager.totalSize
                };
                _this.form.userId = _res.userId;
                //处理销售合计数据
                _this.show.totalSalesAmount = _res.salesTotal.totalSalesAmount;
                _this.show.totalPayAmount = _res.salesTotal.totalPayAmount;
                _this.show.totalSalesQty = _res.salesTotal.totalSalesQty;
                if (_res.items && _res.items.length == 0) {
                  _this.show.totalSalesQty = "--";
                  _this.show.totalSalesAmount = "--";
                  _this.show.totalPayAmount = '--';
                }
                //处理列表数据
                _this.dataSalesItemList = _res.items.map((current, index) => {
                  const items = current.promoDiscItems || [];
                  let _storageType = '', //仓库状态
                    _envoiceType = '', //发票类型
                    _productType = '', //商品类型
                    _unionFlag = '', //联营标记
                    _serialCodeMark = '', //串码标记/信息
                    _lockMark = '', //支票锁定标记
                    _temporaryCardMark = ''; //临时卡标记
                  let meiQuan = 0, //美店
                    meiDou = 0, //美豆
                    dianZhang = 0, //店长券
                    zengDou = 0; //赠豆
                  if (items.length > 0) {
                    items.forEach(item => {
                      if (item.typeCode === "ZD67")
                        meiQuan = (item.amount / 100).toFixed(2) || "0.00"; //美店
                      if (item.typeCode === "ZD12" || item.typeCode === "ZD73")
                        meiDou = (item.amount / 100).toFixed(2) || "0.00"; //美豆
                      if (item.typeCode === "ZD42")
                        dianZhang = (item.amount / 100).toFixed(2) || "0.00"; //店长券
                      if (item.typeCode === "ZD20") zengDou += item.amount;
                      if (item.typeCode === "ZD11") zengDou += item.amount; //赠豆
                    });
                  }

                  // 促销金额 ：美券{promoItems.typeCode=ZD67}元，美豆{promoItems.typeCode=ZD12}元
                  // 店长券 ：{promoItems.typeCode=ZD42}
                  // 赠豆：{promoItems.typeCode=ZD20}+{promoItems.typeCode=ZD11}

                  // 仓库状态：1门店库存、2 DC在库、3 DC在途、4厂家带安'----Integer
                  switch (current.storageType) {
                    case 1:
                      _storageType = '门店库存';
                      break;
                    case 2:
                      _storageType = 'DC在库';
                      break;
                    case 3:
                      _storageType = 'DC在途';
                      break;
                    case 4:
                      _storageType = '厂家带安';
                      break;
                    default:
                      _storageType = !current.storageType && '--';
                  }
                  // 发票类型：0 专票、2 普票、41 卷票、51 电子发票----string
                  switch (current.envoiceType) {
                    case "0":
                      _envoiceType = '专票';
                      break;
                    case "2":
                      _envoiceType = '普票';
                      break;
                    case "41":
                      _envoiceType = '卷票';
                      break;
                    case "51":
                      _envoiceType = '电子发票';
                      break;
                    default:
                      _envoiceType = !current.envoiceType && '--';
                  }
                  // 商品类型：0常规、1保内延保、2保外延保----Integer
                  switch (current.productType) {
                    case 0:
                      _productType = '常规';
                      break;
                    case 1:
                      _productType = '保内延保';
                      break;
                    case 2:
                      _productType = '保外延保';
                      break;
                    case 3:
                      _productType = '延保';
                      break;
                    case 4:
                      _productType = '赠品';
                      break;
                    default:
                      _productType = !current.productType && '--';
                  }
                  // 临时卡标记：1是 、 0否----String
                  switch (current.temporaryCardMark) {
                    case "1":
                      _temporaryCardMark = '是';
                      break;
                    case "0":
                      _temporaryCardMark = '否';
                      break;
                    default:
                      _temporaryCardMark = !current.temporaryCardMark && '--';
                  }
                  // 联营标记：0  否 、1 是----Integer
                  switch (current.unionFlag) {
                    case 1:
                      _unionFlag = '是';
                      break;
                    case 0:
                      _unionFlag = '否';
                      break;
                    default:
                      _unionFlag = current.unionFlag;
                  }
                  // 串码标记/信息：0 否 、  1是 、其他原样返回----String
                  switch (current.serialCodeMark) {
                    case "1":
                      _serialCodeMark = '是';
                      break;
                    case "0":
                      _serialCodeMark = '否';
                      break;
                    default:
                      _serialCodeMark = !current.serialCodeMark && '--';
                  }
                  // 支付锁定标记：1是----String
                  if (current.lockMark == "1") {
                    _lockMark = '是';
                  } else if(current.lockMark == "0") {
                    _lockMark = '否';
                  } else {
                    _lockMark = !current.lockMark && '--'
                  }

                  //如果字段返回值为null，展示为--
                  for (let v in current) {
                    if (typeof current[v] == 'undefined' || !current[v] || current[v] == null || current[v] == 'null' || parseInt(current[v]) == 'NAN') {
                      current[v] = '--';
                    }
                  }
                  return Object.assign({}, current, {
                    orderTypeName: _this.config.status.find(cur => {
                      return cur.value === current.orderType;
                    }).label,
                    _salesAmount: (current.salesAmount != '--' && (current.salesAmount / 100).toFixed(2)) || "0.00",//实付金额
                    _amount: (!meiQuan && !meiDou) ? "--" : ("美券" + meiQuan + "元，" + "美豆" + meiDou + "元"), //促销金额
                    // _meiQuan: meiQuan && "美券" + meiQuan + "元", //美券
                    _dianZhang: (!dianZhang) ? "--" : (dianZhang + "元"), //店长券
                    _ticketNum: (!current.ticketNum) ? '--' : current.ticketNum,//入场券号
                    _zengDou: (!zengDou) ? "--" : ((zengDou / 100).toFixed(2) + "元"), //赠豆
                    _salesChannel: _this.config._channel[current.salesChannel], //渠道
                    _payAmount: (current.payAmount != '--' && (current.payAmount / 100).toFixed(2)) || "0.00",//实付金额
                    _retailPrice: (current.retailPrice1 != '--' && (current.retailPrice1 / 1).toFixed(2)) || "0.00",//商品原价
                    _amountMoney: (current.amountMoney != '--' && (current.amountMoney / 1).toFixed(2)) || "0.00",//欠款金额
                    _repayment: (current.repayment != '--' && (current.repayment / 1).toFixed(2)) || "0.00",//还款金额
                    _storageType: _storageType,//仓库状态
                    _envoiceType: _envoiceType,//发票类型
                    _productType: _productType,//商品类型
                    _temporaryCardMark: _temporaryCardMark,//临时卡标记
                    _unionFlag: _unionFlag,//联营标记
                    _serialCodeMark: _serialCodeMark,//串码标记/信息
                    _lockMark: _lockMark,//支票锁定标记
                  });
                });
              } else {
                __errorhandle(response);
              }
            } else {
              __errorhandle(response);
            }
          },
          reject => {
            _this.loading = false;
          }
        );
      },

      //查询品牌编码列表
      getBrandCodeLists(formBrand) {
        this.$refs[formBrand].validate(valid => {
          if (valid) {
            this.formBrand.page.currentPage = 1;
            this.__getBrandCodeLists();
          }
        });
      },

      //查询品牌编码列表
      __getBrandCodeLists() {
        let requestPara = {};

        this.formBrand.loading = true;
        const _this = this;
        let queryAPI = function () {
        };
        if (this.formBrand.type === "dialogGetBrandCode") {
          queryAPI = API.queryBrandList;
          requestPara = {
            brandCodeOrName: this.formBrand.brandCodeOrName,
            currentPage: this.formBrand.page.currentPage,
            pageSize: this.formBrand.page.pageSize
          };
        } else if (this.formBrand.type === "dialogGetSupplierCode") {
          queryAPI = API.querySupplierList;
          requestPara = {
            supplierCodeOrName: this.formBrand.brandCodeOrName,
            currentPage: this.formBrand.page.currentPage,
            pageSize: this.formBrand.page.pageSize
          };
        }
        queryAPI(requestPara).then(response => {
          _this.formBrand.loading = false;
          if (response.success) {
            if (response.response) {
              const _res = response.response;
              _this.formBrand.page = {
                currentPage: _res.pager.currentPage,
                pageSize: _res.pager.pageSize,
                totalPage: _res.pager.totalSize
              };
              _this.BrandCodeLists = _res.list || [];
            }
          } else {
            _this.formBrand.loading = false;
            _this.BrandCodeLists = [];
          }
        });
      },

      //显示弹窗
      showDialog(type) {
        this._initFormBrand();
        this.formBrand.type = type;
        if (type === "dialogGetSupplierCode") {
          this.dialogGetSupplierCode = true;
        } else if (type === "dialogGetBrandCode") {
          this.dialogGetBrandCode = true;
        }
      },

      //关闭品牌弹窗
      checkedFormBrand(row) {
        this.form.brand = row.brandCode;
        this.dialogGetBrandCode = false;
      },

      //关闭供应商弹窗
      checkedFormSupplier(row) {
        this.form.supplierCode = row.supplierCode;
        this.dialogGetSupplierCode = false;
      },

      //重置form
      resetForm() {
        // this.form = {};
        this.init(); //init
      },

      changeTimes(val) {},

      //当前页点击事件
      handleCurrentChange(val) {
        //todo 疑惑， 传递过去的this 应该是window
        this.page.currentPage = val;
        this.__queryReturnRequestList();
      },

      //导出报表生成数据
      handleExport() {
        const requestPara = getRequestPararQuery(this);
        const _times = this.form.times;
        const _this = this;
        let timer = null;
        if (_times[1] - _times[0] > (1000 * 60 * 60 * 24 * 30)) {//只能下载30天内数据
          _this.$message.error("只能导出30天内数据");
          return
        }

        function __errorhandle(response) {
          if (response.respMsg) {
            _this.$message.error("接口querySalesItemList", response.respMsg);
          }
        }

        this.showProgerssBar = true;
        timer = setInterval(() => {
          _this.percentage++;
          if (_this.percentage > 100) {
            clearTimeout(timer);
            _this.percentage = 0;
          }
        }, 10);
        function __down(data) {
          if (data && data.response) {
            _this.form.cookieDomain = data.response;
            _this.showDownloadLink = true;
          }
        }

        API.downSalesItemList(requestPara).then(
          response => {
            if (response && response.data && response.data.success == true) {
              __down(response.data);
              _this.showProgerssBar = false;
              _this.percentage = 0;

            } else {
              __errorhandle(response.respMsg);
            }
          },
          reject => {

          }
        )
      },

      //下载
      handleDownload() {
        let _this = this, href = '', downloadElement = '', params = {
          userId: this.form.userId,
          ip: this.form.cookieDomain
        };
        API.saleFileExit(params).then(
          response => {
            if (response) {
              if (response.respCode && response.respCode == 1) {
                _this.showDownloadLink = false;
                window.open('//' + _this.form.cookieDomain + '/down?storeCode=' + _this.form.userId,'_self');
                return false;
              } else {
                if (response.respMsg) {
                  _this.$message.error(response.respMsg);
                }
              }
            }
          },
          reject => {

          }
        )
      },

      //品牌弹窗的页面点击事件
      handleCurrentChangeByBrandCode(val) {
        this.formBrand.page.currentPage = val;
        this.__getBrandCodeLists();
      },

      //调用子组件的方法获得id值
      getSaleDepartmentsId (data) {
        this.form.storeCodes = data.storeCodes;
      },
    }
  };
</script>

