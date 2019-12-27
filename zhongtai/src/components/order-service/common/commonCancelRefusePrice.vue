<template>
  <el-row class="common-money-group cmg__cancelRefuse" data-before="促销优惠抵扣明细">
    <!--扣款明细 start-->
    <!--扣款明细显示条件：有美豆信息，或者有赠品信息-->
    <el-row class="cmg__deduct-money">
      <el-row class="cmg__deduct-money-title">
        <span>赠美豆</span>&nbsp;
        <el-popover
          placement="right-start"
          width="200"
          trigger="hover">
          <p>美豆明细</p>
          <p>1、收回赠豆：促销赠{{orderDetail.giftGomeBean.promotionGomeBeanNum}}美豆；
            购物赠{{orderDetail.giftGomeBean.payDeliveredGomeBeanNum}}美豆；
          </p>
          <p>2、如赠送美豆已使用等导致账户里美豆不足时，将使用现金抵扣，100美豆等于抵扣1元；</p>
          <p>3、如使用美易分支付/分期支付，美易分支付/分期支付金额不可参与美豆抵扣，当用户账户美豆不足时，需补够美豆。</p>
          <el-button slot="reference" class="cmg__popover-tips">?</el-button>
        </el-popover>
      </el-row>
      <!--预计扣款金额显示条件：有美豆信息，或者有赠品信息-->
      <el-row class="cmg__deduct-money-item" data-before="预计扣款金额：">
        <em class="cmg__em">-{{realDeductAmount | formatMoney}}</em>
      </el-row>
      <el-row v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}')">
        <el-row class="cmg__deduct-money-item" data-before="需补购美豆：" v-if="orderDetail.giftGomeBean.supplyGomeBeanNum && orderDetail.giftGomeBean.supplyGomeBeanNum > 0">
          <em class="cmg__em">{{orderDetail.giftGomeBean.supplyGomeBeanNum}}美豆</em>
        </el-row>
        <el-row class="cmg__deduct-money-item" data-before="美豆现金抵扣：" v-if="deductGomeBeanAmount">
          <span class="cmg__span">
           -{{deductGomeBeanAmount | formatMoney}}&nbsp;
          </span>
        </el-row>
        <el-row class="cmg__promotions-table" v-if="(orderDetail.giftGomeBean && JSON.stringify(orderDetail.giftGomeBean) != '{}')">
          <table class="_table">
            <thead>
            <tr>
              <th>需回收美豆</th>
              <th>账户余额</th>
              <th>可收回美豆</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                {{orderDetail.giftGomeBean.totalGiftGomeBeanNum}}美豆
              </td>
              <td>
                {{orderDetail.giftGomeBean.accountAvailableGomeBeanNum}}美豆
              </td>
              <td>
                -{{orderDetail.giftGomeBean.needReturnGomeBeanNum}}美豆
              </td>
            </tr>
            </tbody>
          </table>
        </el-row>
      </el-row>
    </el-row>
    <!--扣款明细 end-->
    <!--退款明细 start-->
    <el-row class="cmg__refund-money">
      <el-row class="cmg__refund-money-title">
        <span>退款金额</span>&nbsp;
        <el-popover
          placement="right-start"
          width="200"
          trigger="hover">
          <p>退款明细</p>
          <p>1、计算公式：预计退款金额=商品售价-折扣优惠金额-退还美豆价值金额-使用美券金额-赠品促销分摊总额-增豆抵扣金额；</p>
          <p>2、使用美券金额请去订单详情页查看；</p>
          <p>3、满减满折促销优惠金额+使用店长券折扣金额=折扣优惠金额，具体折扣优惠金额可取订单详情页中查看；</p>
          <el-button slot="reference" class="form__popover__tips">?</el-button>
        </el-popover>
      </el-row>
      <el-row class="cmg__refund-money-item" data-before="预计退款金额：">
        <span class="cmg__span">
          <em class="cmg__em" v-if="suggestRefundAmount">
            {{suggestRefundAmount < 0 ? 0 : suggestRefundAmount | formatMoney}}
          </em>
          <em class="cmg__em" v-else>暂无金额</em>
        </span>
      </el-row>
    </el-row>
    <!--退款明细 end-->
  </el-row>
</template>
<script>
  import Env from '@/api/env'

  export default {
    filters: {
      formatMoney(value) {
        "use strict";
        return '￥' + Number(value).toFixed(2);
      }
    },
    props: {
      deductGomeBeanAmount: '',
      realDeductAmount: '',
      suggestRefundAmount: '',
      orderDetail: {}
    },
    data() {
      return {
        cookieDomain: ''
      }
    },
    created() {
      this.cookieDomain = Env.cookieDomain;
    },
    methods: {}
  }
</script>
