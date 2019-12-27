<template>
    <el-row class="sl-main__promotionDetail" data-before="促销优惠抵扣明细" v-if="returnExchangeDetail.returnRefundAgent">
        <!--扣款明细 start-->
        <!--扣款明细显示条件：有美豆信息，或者有赠品信息-->
        <el-row class="sl__deduct-money" data-before="扣款明细"
                v-if="(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto &&
                JSON.stringify(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto) != '{}') ||
                (returnExchangeDetail.returnRefundAgent.shareFreeGifts &&
                returnExchangeDetail.returnRefundAgent.shareFreeGifts.length > 0)">
            <!--预计扣款金额显示条件：有美豆信息，或者有赠品信息-->
            <el-row v-if="(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto &&
                JSON.stringify(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto) != '{}') ||
                      (returnExchangeDetail.returnRefundAgent.shareFreeGifts &&
                      returnExchangeDetail.returnRefundAgent.shareFreeGifts.length > 0)">
              <el-row class="sl__deduct_item" data-before="预计扣款金额："
                      v-if="returnExchangeDetail.returnRefundAgent.displayAllDeductAmount">
                <em class="sl__em">-{{returnExchangeDetail.returnRefundAgent.displayAllDeductAmount | formatMoney}}</em>
              </el-row>
            </el-row>
            <el-row v-if="(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto &&
                JSON.stringify(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto) != '{}')">
                <el-row class="sl__deduct_item" data-before="美豆现金抵扣："
                        v-if="returnExchangeDetail.returnRefundAgent.deductGomeBeanAmount">
    <span class="sl__span">
     -{{returnExchangeDetail.returnRefundAgent.deductGomeBeanAmount | formatMoney}}&nbsp;
    <el-popover
            placement="right-start"
            width="200"
            trigger="hover">
    <p>美豆明细</p>
      <p>1、需收回赠豆：促销赠{{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.promotionGomeBeanNumber}}美豆；
        购物赠{{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.payDLGiftGomeBeanNumber}}美豆；
        </p>
    <p>2、如赠送美豆已使用，导致账户里美豆不足时，将使用现金抵扣，100美豆抵扣1元；</p>
    <el-button slot="reference" class="form__popover__tips">?</el-button>
    </el-popover>
    </span>
                </el-row>
            </el-row>
            <el-row class="sl__promotions_table">
                <table class="_table" v-if="(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto &&
                JSON.stringify(returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto) != '{}')">
                    <thead>
                    <tr>
                        <th>需回收美豆</th>
                        <th>账户余额</th>
                        <th>可收回美豆</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.allGiftGomeBeanNumber}}美豆
                        </td>
                        <td>
                            {{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber}}美豆
                        </td>
                        <td>
                            -{{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.needReturnGomeBeanNumber}}美豆
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-row>
            <el-row v-if="returnExchangeDetail.productDto &&
            returnExchangeDetail.productDto.skuType &&
            returnExchangeDetail.productDto.skuType != 1">
                <el-row class="sl__deduct_item" data-before="赠品促销分摊总额："
                        v-if="returnExchangeDetail.returnRefundAgent.freeGiftShareAmountSum &&
                        returnExchangeDetail.returnRefundAgent.freeGiftShareAmountSum > 0">
                  <span class="sl__span">
                   -{{returnExchangeDetail.returnRefundAgent.freeGiftShareAmountSum | formatMoney}}&nbsp;
                  <el-popover
                          placement="right-start"
                          width="200"
                          trigger="hover">
                    <p>赠品促销分摊明细</p>
                    <p>1、赠品分摊指的是订单拆单后，配送单中主品分摊赠品金额的明细；</p>
                    <p>2、分摊计算明细详见：<router-link :to="{path: '//mpf' + cookieDomain + '/service/helpCenter/commonProblem'}" target="_blank">赠品分摊细则></router-link></p>
                  <el-button slot="reference" class="form__popover__tips">?</el-button>
                  </el-popover>
                  </span>
                </el-row>
                <!--显示条件：赠品促销分摊总额存在并且金额大于0，并且赠品列表大于0-->
                <el-row class="sl__promotions_table"
                        v-if="returnExchangeDetail.returnRefundAgent.freeGiftShareAmountSum &&
                        returnExchangeDetail.returnRefundAgent.freeGiftShareAmountSum > 0 &&
                        returnExchangeDetail.returnRefundAgent.shareFreeGifts &&
                        returnExchangeDetail.returnRefundAgent.shareFreeGifts.length > 0">
                    <el-table
                            border
                            :data="returnExchangeDetail.returnRefundAgent.shareFreeGifts">
                      <el-table-column
                        label="赠品名称">
                        <template slot-scope="scope">
                          <span :title="scope.row.freeGiftName">{{scope.row.freeGiftName}}</span>
                      </template>
                      </el-table-column>
                      <!--<el-table-column-->suggestRefundAmount
                        <!--prop="freeGiftQuantity"-->
                        <!--label="数量">-->
                      <!--</el-table-column>-->
                      <el-table-column
                        label="赠品价值">
                        <template slot-scope="scope">
                          <span>{{scope.row.freeGiftPrice | formatMoney}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="本单分摊总额">
                        <template slot-scope="scope">
                          <span>-{{scope.row.freeGiftShareAmount | formatMoney}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-row>
            </el-row>
        </el-row>
        <!--扣款明细 end-->
        <!--退款明细 start-->
        <el-row class="as__price sl__refund-money">
            <el-row class="sl__refund__title">
                <span>退款明细</span>&nbsp;
                <el-popover
                        placement="right-start"
                        width="200"
                        trigger="hover">
                    <p>退款明细</p>
                    <p>1、当订单仅赠送美豆及赠品时，预计退款金额=商品支付时售价-预计扣款金额-退还美豆（金额）-使用美券（金额）；</p>
                    <p>2、当订单参与其他促销时，上述公式会出现不相等的情况，差值明细可参考订单详情页中计算明细；</p>
                    <p>3、使用美券金额请去订单详情页查看；</p>
                    <el-button slot="reference" class="form__popover__tips">?</el-button>
                </el-popover>
            </el-row>
            <el-row class="sl__refund_item" data-before="预计退款金额：">
    <span class="sl__span">
    <em class="sl__em"
        v-if="returnExchangeDetail.returnRefundAgent.suggestRefundAmount">
      {{returnExchangeDetail.returnRefundAgent.suggestRefundAmount | formatMoney}}
    </em>
    <em class="sl__em" v-else>暂无金额</em>
    </span>
            </el-row>
            <el-row class="sl__refund_item" data-before="退还美豆："
                    v-if="returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto &&
                    returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.sharePayGomeBeanNumber">
    <span class="sl__span">
    <em class="sl__em">+{{returnExchangeDetail.returnRefundAgent.returnGomeBeanAgentDto.sharePayGomeBeanNumber}}美豆</em>
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
            formatMoney (value) {
                "use strict";
                return '￥' + Number(value).toFixed(2);
            }
        },
        props: {
            returnExchangeDetail: {}
        },
        data () {
            return {
              cookieDomain: ''
            }
        },
        created () {
          this.cookieDomain = Env.cookieDomain;
        },
        methods: {
        }
    }
</script>
