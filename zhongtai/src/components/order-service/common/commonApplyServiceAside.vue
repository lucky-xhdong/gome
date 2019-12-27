<template>
    <el-aside class="common-aside" id="common-aside">
        <g-header v-model="header"></g-header>
        <el-row class="order-group common-aside__module">
          <el-row class="order-info__inner" data-before="配送单号：" v-if="asideData.shippingGroupId">
            <span class="as-product-info__span">{{asideData.shippingGroupId}}</span>
          </el-row>
          <el-row>
            <div class="product-group" v-if="asideData.productDto">
              <div class="product-img-group" :data-before="asideData.productDto.skuType == '1' ? '赠品' : ''">
                <img class="product-img" :src="asideData.productDto.imageUrl">
              </div>
              <div class="product-txt">
                <p class="product-txt-title">{{asideData.productDto.prodName}}</p>
                <p class="product-txt-price-num">
                  <span class="product-txt-price">{{(!asideData.productDto.price || asideData.productDto.price < 0) ? 0 : asideData.productDto.price | formatMoney}}</span>
                  <span class="product-txt-num">x{{asideData.productDto.quantity}}</span>
                </p>
              </div>
            </div>
          </el-row>
        </el-row>
        <el-row class="custom-user-group common-aside__module" v-if="asideData.userInfoDto">
          <el-row class="order-info__inner" data-before="会员卡号：" v-if="asideData.userInfoDto.memberCardNo">
            <span class="as-product-info__span">{{asideData.userInfoDto.memberCardNo}}</span>
          </el-row>
          <el-row class="order-info__inner" data-before="顾客姓名：" v-if="asideData.userInfoDto.userName">
            <span class="as-product-info__span">{{asideData.userInfoDto.userName}}</span>
          </el-row>
          <el-row class="order-info__inner" data-before="顾客电话：" v-if="asideData.userInfoDto.mobilePhone">
            <span class="as-product-info__span">{{asideData.userInfoDto.mobilePhone}}</span>
            <el-button size="mini" type="primary" class="as-product-info__button" v-show="showButton" v-if="asideData.userInfoDto.mobilePhone" @click="queryFullPhoneNo">查看</el-button>
          </el-row>
          <el-row class="order-info__inner" data-before="配送地址：" v-if="asideData.userInfoDto.originalUserAddress">
            <span class="as-product-info__span">{{asideData.userInfoDto.originalUserAddress}}</span>
          </el-row>
        </el-row>
        <el-row class="apply-user-group common-aside__module" v-if="asideData.submitRoStoreDto">
          <el-row class="order-info__inner" data-before="申请终端：" v-if="asideData.submitRoStoreDto.invokeFrom">
            <span class="as-product-info__span">{{asideData.submitRoStoreDto.invokeFrom}}</span>
          </el-row>
          <el-row class="order-info__inner" data-before="申请人编号：" v-if="asideData.submitRoStoreDto.submitRoStoreStaffId">
            <span class="as-product-info__span">{{asideData.submitRoStoreDto.submitRoStoreStaffId}}</span>
          </el-row>
          <el-row class="order-info__inner" data-before="申请人姓名：" v-if="asideData.submitRoStoreDto.submitRoStoreStaffName">
            <span class="as-product-info__span">{{asideData.submitRoStoreDto.submitRoStoreStaffName}}</span>
          </el-row>
          <el-row class="order-info__inner" data-before="申请人岗位：" v-if="asideData.submitRoStoreDto.submitRoStoreStaffRole">
            <span class="as-product-info__span">{{asideData.submitRoStoreDto.submitRoStoreStaffRole}}</span>
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
            asideData: {
                type: Object
            }
        },
        data () {
            return {
                header:{
                    "content":"商品信息"// tit名字
                },
                showButton: true,
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
                    commerceItemId: this.asideData.commerceItemId,
                    shippingGroupId: this.asideData.shippingGroupId,
                };
                API.queryFullPhoneNo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.asideData.userInfoDto.mobilePhone = response.response;
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
