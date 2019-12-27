<template>
  <el-row>
    <el-row class="cr-detail__deliveryInfo" v-if="orderDetail.shippingGroup">
      <el-col :span="8" data-before="配送单号：" class="deliveryInfo__inner">
        {{orderDetail.shippingGroup.shippingGroupId}}
      </el-col>
      <el-col :span="8" data-before="配送方式：" class="deliveryInfo__inner">
        {{orderDetail.shippingGroup.deliveryMethodDesc}}
      </el-col>
      <el-col :span="8" data-before="配送时间：" class="deliveryInfo__inner">
        {{orderDetail.shippingGroup.deliveryDate}}
      </el-col>
    </el-row>
    <el-row class="cr-detail__deliveryInfo" v-if="pageStatus == 'cancelDelivery_detail' && orderDetail.applicantInfo">
      <el-col :span="8" data-before="申请人编号：" class="deliveryInfo__inner" v-if="orderDetail.applicantInfo.applicantId">
        {{orderDetail.applicantInfo.applicantId}}
      </el-col>
      <el-col :span="8" data-before="申请人姓名：" class="deliveryInfo__inner" v-if="orderDetail.applicantInfo.applicantName">
        {{orderDetail.applicantInfo.applicantName}}
      </el-col>
      <el-col :span="8" data-before="申请人岗位：" class="deliveryInfo__inner" v-if="orderDetail.applicantInfo.applicantPosition">
        {{orderDetail.applicantInfo.applicantPosition}}
      </el-col>
      <el-col :span="8" data-before="申请终端：" class="deliveryInfo__inner" v-if="orderDetail.applicantInfo.invokeFrom">
        {{orderDetail.applicantInfo.invokeFrom}}
      </el-col>
      <el-col :span="8" data-before="申请时间：" class="deliveryInfo__inner" v-if="orderDetail.applicantInfo.applyDate">
        {{orderDetail.applicantInfo.applyDate}}
      </el-col>
      <el-col :span="8" data-before="下单时间：" class="deliveryInfo__inner" v-if="orderDetail.submittedDate">
        {{orderDetail.submittedDate}}
      </el-col>
    </el-row>
    <el-row class="cr-detail__table">
      <el-table :data="orderDetail.shippingGroup.commerceItems">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="productInfo">
              <div class="img-group" :data-after="scope.row.type == 2 ? '赠品' : ''">
                <img :src=scope.row.imageUrl :alt=scope.row.displayName>
              </div>
              <div class="txt-group">
                <span class="txt-title" :title="scope.row.displayName">{{ scope.row.displayName }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in configItmes"
          :key=index
          :prop=item.prop
          :label=item.label>
        </el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>
<script>
  export default {
    props: {
      orderDetail: {
        type: Object
      }
    },
    data () {
      return {
        configItmes: [
          {label: "商品编码", prop: "skuNo"},
          {label: "价格", prop: "salePrice"},
          {label: "数量", prop: "quantity"},
          {label: "安装方式", prop: "installMethodDesc"},
          {label: "发票类型", prop: "invoiceMediaType"},
          {label: "安装时间", prop: "installDate"},
        ],
        pageStatus: ''
      }
    },
    created() {
      this.pageStatus = this.$router.history.current.name;
    }
  }
</script>
