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

        <el-form-item label="商品名称：">
          <el-input placeholder="请输入商品名称" v-model="form.skuName"></el-input>
        </el-form-item>
        <el-form-item label="促销员编码：">
          <el-input placeholder="请输入促销员编码" v-model="form.sellerCode"></el-input>
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
        <el-form-item label="配送单号：">
          <el-input placeholder="请输入配送单号" v-model="form.deliveryId"></el-input>
        </el-form-item>
        <el-form-item label="促销费公司类别：">
          <el-select v-model="form.companyType" placeholder="请选择">
            <el-option v-for="(item, index) in config.companyType"
                       :label="item.label" :value="item.value"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="零售单状态：">-->
        <!--<el-select v-model="form.status" placeholder="请选择">-->
        <!--<el-option v-for="(item, index) in config.status"-->
        <!--:label="item.label" :value="item.value"-->
        <!--:key="index">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
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
        <el-button size="mini" @click="handleDown()" title="只能导出30天内数据" v-if="LOGINDATA.promotionFee_list_down1">导出</el-button>
        </span>
        <commonSalesReportColumnSetting :dataSalesItemList="dataSalesItemList" :configItmesAll="configItmesAll"></commonSalesReportColumnSetting>
      </el-row>
    </el-row>
    <!--销售统计 end-->

    <!--报表信息 start-->
    <div class="common-table common-table-01">
      <el-table ref="promotionFeeTable"
                :data="dataSalesItemList"
                v-loading="loading"
                height="500">
        <el-table-column
          v-for="(item, index) in configItmesAll"
          :key="index"
          :prop=item.prop
          :label=item.label
          :min-width=item.width
          v-if="item.className == 'show'">
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
    <!--报表信息 end-->
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
  import commonSalesReportColumnSetting from "@/components/order-service/common/commonSalesReportColumnSetting";

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
      salesOrgCode: content.form.salesOrgCode, //销售组织代码
      storeCodes: content.form.storeCodes, //门店代码
      deliveryId: content.form.deliveryId, //配送单号
      channelCode: content.form.salesChannel === 0 ? "" : content.form.salesChannel, //渠道
      skuName: content.form.skuName, //商品名称
      companyType: content.form.companyType, //促销费公司类别
      beginTime: times.start,//日期----
      endTime: times.end,//日期----
      mainCategoryCode: content.form.kinds == "-1" ? "" : content.form.kinds, //品类----
      brandCode: content.form.brand, //品牌编码----
      supplierCode: content.form.supplierCode, //供应商编码----
      sellerCode: content.form.sellerCode, //促销员编码----
      currentPage: content.page.currentPage, //
      pageSize: content.page.pageSize,
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
          salesOrgCode: "", //销售组织代码
          storeCodes: [], //门店代码
          kinds: "", //种类
          brand: "", //品牌
          skuName: "", //商品名称
          supplierCode: "", //供货商代码
          sellerCode: "", //促销员编码
          deliveryId: "", //配送单号
          status: "", //状态
          salesChannel: "", //销售渠道
          companyType: "", //促销费公司类别
          times: []
        },

        formBrand: {},
        rulesFormBrand: {
          brandCodeOrName: [
            {required: true, message: "请输入", trigger: "blur"}
          ]
        },
        BrandCodeLists: [],

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
            // { value: 20, label: "金力对公" }
          ], //渠道
          companyType: [
            {value: "", label: "全部"},
            {value: "01", label: "电器"},
            {value: "02", label: "延保"},
            {value: "03", label: "易用通"},
            {value: "04", label: "恒信"},
            {value: "05", label: "战圣"},
            {value: "06", label: "配件"},
            {value: "07", label: "电器采购"},
            {value: "08", label: "售后"},
            {value: "09", label: "国美在线"}
          ], //公司类别
          _channel: {},
          times: [new Date(), new Date()]
        },
        configItmes: [],
        dataSalesItemList: [],
        rules: {},
        treeItems: [],
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        configItmesAll: [
          {label: "促销员编码", prop: "sellerCode", className: 'show', width: 100, disabled: false},//--show
          {label: "促销员", prop: "sellerName", className: 'show', width: 150, disabled: false},//--show
          // {label: "职务代码", prop: "positionCode", className: 'hide', width: 100, disabled: true},//--
          // {label: "职务名称", prop: "positionName", className: 'hide', width: 150, disabled: true},//--

          // {label: "大区ID", prop: "regioneId", className: 'hide', width: 100, disabled: true},//--
          // {label: "大区名称", prop: "regioneName", className: 'hide', width: 150, disabled: true},//--show
          {label: "分部代码", prop: "salesOrgCode", className: 'hide', width: 100, disabled: false},//--
          {label: "分部名称", prop: "salesOrgName", className: 'show', width: 250, disabled: false},//--show
          {label: "销售门店代码", prop: "storeCode", className: 'hide', width: 150, disabled: false},//--
          {label: "销售门店", prop: "storeName", className: 'show', width: 200},//--show

          {label: "事业部门代码", prop: "mainCategoryCode", className: 'hide', width: 150, disabled: false},
          {label: "事业部门名称", prop: "mainCategoryName", className: 'show', width: 120, disabled: false},//--
          {label: "品类代码", prop: "categoryCode", className: 'hide', width: 100, disabled: false},//--
          {label: "品类名称", prop: "categoryName", className: 'show', width: 150, disabled: false},//--show
          {label: "品牌代码", prop: "brandCode", className: 'hide', width: 100, disabled: false},//--
          {label: "品牌名称", prop: "brandName", className: 'show', width: 200, disabled: false},//--show
          {label: "业务机型代码", prop: "bizType", className: 'hide', width: 150, disabled: false},//--
          {label: "业务机型名称", prop: "bizTypeName", className: 'show', width: 120, disabled: false},//--show
          {label: "促销费类型", prop: "cxfType", className: 'hide', width: 120, disabled: false},//--show
          {label: "商品编码", prop: "skuNo", className: 'show', width: 100, disabled: false},//--show
          {label: "商品名称", prop: "skuName", width: 250, className: 'show', disabled: true},//--show

          {label: "销售金额", prop: "_salesAmount", className: 'show', width: 100, disabled: false},//--show
          {label: "销售时间", prop: "salesTime", className: 'show', width: 180, disabled: false},//--show
          {label: "销售数量", prop: "salesQty", className: 'show', width: 100, disabled: false},//--show
          {label: "配送单号", prop: "deliveryId", className: 'show', width: 120, disabled: false},//--show
          {label: "供应商代码", prop: "supplierCode", className: 'hide', width: 150, disabled: false},//--
          {label: "供应商名称", prop: "supplier", className: 'show', width: 200, disabled: false},//--show
          {label: "渠道", prop: "_salesChannel", className: 'show', width: 100, disabled: false},//--show

          {label: "提奖限价", prop: "cxbz", className: 'show', width: 100, disabled: false},//--show
          {label: "国美促销费", prop: "gmcxf", className: 'hide', width: 100, disabled: false},//--show
          {label: "厂家促销费", prop: "cjcxf", className: 'hide', width: 100, disabled: false},//--show
          {label: "促销费公司类别代码", prop: "gslb", className: 'hide', width: 200, disabled: false},//--
          {label: "促销费公司类别名称", prop: "gslbmc", className: 'show', width: 200, disabled: false},//--show
          {label: "计算比例", prop: "cxfbl", className: 'hide', width: 100, disabled: false},//--show
          {label: "促销费合计", prop: "cxfhj", className: 'hide', width: 150, disabled: false},//--show
          {label: "实发促销费合计", prop: "cxf", className: 'show', width: 150, disabled: false},//--show
        ],
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
    mounted() {
    },
    //vuex取值
    computed: mapState({
      LOGINDATA: "LOGINDATA"
    }),
    components: {
      commonSalesReportTree,
      commonSalesReportColumnSetting
    },
    methods: {
      init() {
        let _this = this;
        this.config.channel.forEach((item) => {
          this.config._channel[item.value] = item.label
        });
        this.form.times = [new Date(), new Date()];
        (this.form.brand = ""), (this.form.skuName = ""), (this.form.kinds = -1); //默认是全选
        this.form.status = 0;
        this.form.supplierCode = "";
        this.form.salesChannel = 0;
        this.form.storeCodes = [];
        this.form.sellerCode = "";
        this.form.companyType = "";
        this.form.deliveryId = "";
        //重置操作需要清空分部列表和部门树勾选状态，因为通过获取dom元素来更新数据，所以放在this.$nextTick()中
        this.$nextTick(() => {
          _this.$refs.salesReportTree.checkedTreeItems = [];
          _this.$refs.salesReportTree.setCheckedKeys();
        });
        this.__queryReturnRequestList();
        this._initFormBrand();
      },

      //初始化品牌信息
      _initFormBrand() {
        this.formBrand.brandCodeOrName = "";
        this.formBrand.loading = false;
        this.formBrand.page = {
          currentPage: 1,
          pageSize: 10,
          totalPage: 1
        };
      },

      //获取品类信息
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

      //获取促销费报表信息
      queryReturnRequestList() {
        this.page.currentPage = 1;
        this.__queryReturnRequestList();
      },

      //获取促销费报表信息
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
            _this.$message.error("接口queryPromotionFeeList：" + response.respMsg);
          }
        }

        _this.loading = true;
        API.queryPromotionFeeList(requestPara).then(
          response => {
            _this.loading = false;
            if (response.response && response.response.success) {
              if (response.response.response) {
                const _res = response.response.response;
                //处理返回数据
                //处理分页数据
                _this.page = {
                  currentPage: _res.paper.currentPage,
                  pageSize: _res.paper.pageSize,
                  totalPage: _res.paper.totalSize
                };
                //处理销售合计数据
                // _this.show.totalSalesAmount = _res.salesTotal.totalSalesAmount;
                // _this.show.totalPayAmount = _res.salesTotal.totalPayAmount;
                // _this.show.totalSalesQty = _res.salesTotal.totalSalesQty;
                if (_res.items && _res.items.length == 0) {
                  _this.show.totalSalesQty = "--";
                  _this.show.totalSalesAmount = "--";
                   _this.show.totalPayAmount = '--';
                }
                //处理列表数据
                _this.dataSalesItemList = _res.items.map((current, index) => {
                  const items = current.promoDiscItems || [];
                  let meiQuan = 0, //美店
                    meiDou = 0, //美豆
                    dianZhang = 0, //店长券
                    zengDou = 0; //赠豆
                  if (items.length > 0) {
                    items.forEach(item => {
                      if (item.typeCode === "ZD67")
                        meiQuan = (item.amount / 100).toFixed(2) || "0.00"; //美店
                      if (item.typeCode === "ZD12")
                        meiDou = (item.amount / 100).toFixed(2) || "0.00"; //美豆
                      if (item.typeCode === "ZD42")
                        dianZhang = (item.amount / 100).toFixed(2) || "0.00"; //店长券
                      if (item.typeCode === "ZD20") zengDou += item.amount;
                      if (item.typeCode === "ZD11") zengDou += item.amount; //赠豆
                    });
                  }

                  //如果字段返回值为null，展示为--
                  for (let v in current) {
                    if (typeof current[v] == 'undefined' || !current[v] || current[v] == null || current[v] == 'null' || parseInt(current[v]) == 'NAN') {
                      current[v] = '--';
                    }
                  }
                  return Object.assign({}, current, {
                    // orderTypeName: _this.config.status.find(cur => {
                    //   return cur.value === current.orderType;
                    // }).label,
                    _amount: (!meiQuan && !meiDou )?"--":("美券" + meiQuan + "元，" + "美豆" + meiDou + "元"), //促销金额
                    _dianZhang: (!dianZhang) ?"--":(dianZhang + "元"), //店长券
                    _zengDou:  (!zengDou)?"--":((zengDou/100).toFixed(2) + "元"), //赠豆
                    _salesChannel: _this.config._channel[current.salesChannel], //渠道
                    _salesAmount: (current.salesAmount != '--' && (current.salesAmount / 100).toFixed(2)) || "0.00",
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

      //获取品牌编码信息
      getBrandCodeLists(formBrand) {
        this.$refs[formBrand].validate(valid => {
          if (valid) {
            this.formBrand.page.currentPage = 1;
            this.__getBrandCodeLists();
          }
        });
      },

      //获取品牌编码信息
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

      //关闭品牌编码弹窗
      checkedFormBrand(row) {
        this.form.brand = row.brandCode;
        this.dialogGetBrandCode = false;
      },

      //关闭供应商编码弹窗
      checkedFormSupplier(row) {
        this.form.supplierCode = row.supplierCode;
        this.dialogGetSupplierCode = false;
      },

      //重置表单
      resetForm() {
        // this.form = {};
        this.init(); //init
      },

      changeTimes(val) { },

      //当前页点击事件
      handleCurrentChange(val) {
        //todo 疑惑， 传递过去的this 应该是window
        this.page.currentPage = val;
        this.__queryReturnRequestList();
      },

      //报表下载
      handleDown() {
        const requestPara = getRequestPararQuery(this);
        const _times = this.form.times;
        const _this = this;
        if (_times[1] - _times[0] > (1000 * 60 * 60 * 24 * 30)) {//只能下载30天内数据
          _this.$message.error("只能导出30天内数据");
          return
        }

        function __errorhandle(response) {
          if (response.respMsg) {
            _this.$message.error("接口queryPromotionFeeList：" + response.respMsg);
          }
        }

        this.loading = true;
        function __down(data) {
          //  var aTag = document.createElement('a');
          //   var blob = new Blob([data]);
          //   aTag.download = 'fileName.xls';
          //   aTag.href = URL.createObjectURL(blob);
          //   aTag.click();
          //   URL.revokeObjectURL(blob);
          var blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = `促销费统计${_this.show.showTime.start}-${_this.show.showTime.end}.xls`; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //downPromotionFeeList点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }

        API.downPromotionFeeList(requestPara).then(
          response => {
            if (response && response.data) {
              _this.loading = false;
              __down(response.data);
            } else {
              __errorhandle(response.respMsg);
            }
          },
          reject => {

          }
        )
      },

      //品牌列表当前页事件
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
