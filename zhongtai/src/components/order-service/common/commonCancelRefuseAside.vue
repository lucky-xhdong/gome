<template>
    <el-aside class="cr-detail__aside" id="cr-detail__aside">
        <g-header v-model="asideheader"></g-header>
        <el-row class="aside__userInfo">
            <el-row data-before="会员卡号："v-if="cancelRefuseAsideData.memberCardId">
                <span class="aside__span">{{cancelRefuseAsideData.memberCardId}}</span>
            </el-row>
            <el-row data-before="顾客姓名：" v-if="cancelRefuseAsideData.consigneeName">
                <span class="aside__span">{{cancelRefuseAsideData.consigneeName}}</span>
            </el-row>
            <el-row data-before="顾客电话：" v-if="cancelRefuseAsideData.consigneePhone">
                <span class="aside__span">{{cancelRefuseAsideData.consigneePhone}}</span>
                <el-button size="mini" type="primary" class="as-product-info__button" v-show="showButton" v-if="cancelRefuseAsideData.consigneePhone" @click="queryFullPhoneNo">查看</el-button>
            </el-row>
            <el-row data-before="配送地址：" v-if="cancelRefuseAsideData.consigneeAddress">
                <span class="aside__span">{{cancelRefuseAsideData.consigneeAddress}}</span>
            </el-row>
        </el-row>
        <el-row class="aside__totalPrice">
            <el-row data-before="小计：">
                <span class="aside__span">{{(!cancelRefuseAsideData.orderAmount || cancelRefuseAsideData.orderAmount < 0) ? 0 : cancelRefuseAsideData.orderAmount | formatMoney}}</span>
            </el-row>
            <el-row data-before="美券：">
                <span class="aside__span">{{(!cancelRefuseAsideData.gomeCouponAmount || cancelRefuseAsideData.gomeCouponAmount < 0) ? 0 : cancelRefuseAsideData.gomeCouponAmount | formatMoney}}</span>
            </el-row>
            <el-row data-before="美豆：">
                <span class="aside__span">{{(!cancelRefuseAsideData.gomeBeansAmount || cancelRefuseAsideData.gomeBeansAmount < 0) ? 0 : cancelRefuseAsideData.gomeBeansAmount | formatMoney}}</span>
            </el-row>
            <el-row data-before="实付总金额：">
                <span class="aside__span">{{(!cancelRefuseAsideData.realPayAmount || cancelRefuseAsideData.realPayAmount < 0) ? 0 : cancelRefuseAsideData.realPayAmount | formatMoney}}</span>
            </el-row>
        </el-row>
    </el-aside>
</template>
<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import API from '@/api/order-service/applyService';
    export default {
        props: {
            cancelRefuseAsideData: {
                type: Object
            }
        },
        data () {
            return {
                showButton: true,
                asideheader:{
                    "content":"配送单信息"// tit名字
                },
                isFixed: false
            }
        },
        //局部过滤器，格式化金额
        filters: {
            formatMoney (value) {
                "use strict";
                return '￥' + Number(value).toFixed(2);
            }
        },
        methods: {
            //查看完事手机号
            queryFullPhoneNo () {
                let _this = this;
                let params = {
                    commerceItemId: this.cancelRefuseAsideData.commerceItems[0].commerceItemId,
                    shippingGroupId: this.cancelRefuseAsideData.shippingGroupId,
                };
                API.queryFullPhoneNo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.cancelRefuseAsideData.consigneePhone = response.response;
                            _this.showButton = false;
                        }
                    } else {
                        if (response.respMsg) {
                            _this.loading = false;
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            }
        }
    }
</script>
