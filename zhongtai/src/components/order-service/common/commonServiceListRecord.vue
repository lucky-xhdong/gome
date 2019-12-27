<template>
    <el-row class="sl-main__serviceRecord" data-before="退换货记录">
        <el-row class="sr__list">
            <el-row class="sr__list__inner" v-for="(item, index) in returnExchangeDetail.returnRequestHistoryList"  v-if="item.historyDes" :key="item.id">
              <span class="time">{{item.historyDateTimeStr}}</span>
              <i class="el-icon-success sr__icon"></i>
              <span class="txt" :title="item.historyDes">{{item.historyDes}}</span>
            </el-row>
        </el-row>
    </el-row>
</template>
<script>
    export default {
        props: {
            "returnExchangeDetail": {}
        }
    }
</script>
