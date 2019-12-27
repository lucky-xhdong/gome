<template>
    <el-row class="sl-main__serviceInfo" :returnExchangeDetail="returnExchangeDetail" data-before="退换货信息">
        <el-row class="si__base">
            <el-col :span="12" data-before="退换货单号：" class="si__base__inner">
                {{returnExchangeDetail.returnRequestBaseInfoDto.returnRequestId}}
            </el-col>
            <el-col :span="12" data-before="退换货方式：" class="si__base__inner">
                {{returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethod}}
            </el-col>
            <el-col :span="12" data-before="退换货类型：" class="si__base__inner">
                <span v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnType == 1">退货</span>
                <span v-else-if="returnExchangeDetail.returnRequestBaseInfoDto.returnType == 2">换货</span>
                <span v-else>换转退</span>
            </el-col>
            <el-col :span="12" data-before="退换货原因：" class="si__base__inner">
                {{returnExchangeDetail.returnRequestBaseInfoDto.returnReason}}
            </el-col>
            <el-col :span="12" data-before="已开凭证：" class="si__base__inner">
                {{returnExchangeDetail.returnRequestBaseInfoDto.returnIssuedProof}}
            </el-col>
            <el-col :span="12" :data-before=replaceName class="si__base__inner">
                {{returnExchangeDetail.addressInfo.customerName}}
            </el-col>
            <el-col :span="12" :data-before=replacePhone class="si__base__inner">
                {{returnExchangeDetail.addressInfo.customerPhone}}
                <el-button size="mini" type="primary" class="as-product-info__button" v-show="showButton"
                           v-if="returnExchangeDetail.addressInfo.customerPhone"
                           @click="queryRefundFullPhoneNo">查看
                </el-button>
            </el-col>
            <el-col :span="12" data-before="退回门店地址：" class="si__base__inner"
                    v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethodCode == 6">
                {{returnExchangeDetail.addressInfo.offlineStoreDetailAddress}}
            </el-col>
            <el-col :span="12" data-before="取货地址：" class="si__base__inner"
                    v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethodCode == 1">
                {{returnExchangeDetail.addressInfo.customerDetailAddress}}
            </el-col>
            <el-col :span="12" data-before="取货时间：" class="si__base__inner"
                    v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethodCode == 1">
                {{returnExchangeDetail.addressInfo.pickupDateTime}}
            </el-col>
            <!--换货增加 start-->
            <el-col :span="12" data-before="换货配送地址：" class="si__base__inner"
                    v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnType == 2 && returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethodCode == 1">
                {{returnExchangeDetail.addressInfo.replaceShipDetailAddress}}
            </el-col>
            <!--换货增加 end-->
        </el-row>
        <el-row class="si__img" data-before="商品图片与检验报告：">
            <div class="si__img__item" v-for="(item, index) in returnExchangeDetail.returnRequestImageList"
                 :key="item.id">
                <img :src="item.imageUrl">
            </div>
        </el-row>
        <el-row class="si__base">
            <el-col data-before="问题描述：" class="si__base__inner">{{returnExchangeDetail.problemDesc}}</el-col>
        </el-row>
    </el-row>
</template>
<script>
    import API from '@/api/order-service/applyService';
    export default {
        props: {
            "returnExchangeDetail": {}
        },
        data () {
            return {
                showButton: true,                       //是否展示查看手机号按钮
                replaceName: '',                        //联系人名称
                replacePhone: '',                       //联系人电话
            }
        },
        computed: {
        },
        created () {
            this.showLable();
        },
        methods: {
            showLable () {
                //如果类型为换货(2)并且方式为上门取件(1)
                if (this.returnExchangeDetail.returnRequestBaseInfoDto.returnType == 2 && this.returnExchangeDetail.returnRequestBaseInfoDto.returnRequestMethodCode == 1) {
                    this.replaceName = "换货联系人：";
                    this.replacePhone = "换货联系电话：";
                }else {
                    this.replaceName = "取货联系人：";
                    this.replacePhone = "取货联系电话：";
                }
            },
            //查看完整手机号
            queryRefundFullPhoneNo () {
                let _this = this, queryType = '';
                let _addressInfo = this.returnExchangeDetail.addressInfo;
//                let _baseInfo = this.returnExchangeDetail.returnRequestBaseInfoDto;
//                if (_baseInfo.returnType == 1) {
//                    queryType = 1;
//                }else {
//                    queryType = 2;
//                }
                //queryType原本是按取货人和换货人的电话号来区分，取货人传1，换货人传2
                //但是因为现在展示的都是取货人的信息，所以不管是退换还是换货，不管是取货人还是换货人都传1
                let params = {
                    returnRequestId: this.$route.query.returnRequestId,
                    queryType: 1
                };
                API.queryRefundFullPhoneNo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _addressInfo.customerPhone = response.response;
                            _this.showButton = false;
                        }
                    } else {
                        if (response.respMsg) {
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            }
        }
    }
</script>
