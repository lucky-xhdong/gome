<template>
  <el-steps :active="returnExchangeDetail._steps" simple class="sl-main__steps">
    <el-step v-for="(item, index) in returnExchangeDetail.returnRequestNodeInfoList"
             :title=item.nodeName
             :key="item.id">
    </el-step>
  </el-steps>
</template>
<script>
export default {
  props: {
    "returnExchangeDetail": {}
  }
}
</script>
