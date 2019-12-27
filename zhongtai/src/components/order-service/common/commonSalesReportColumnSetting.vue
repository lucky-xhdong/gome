<template>
  <span>
    <el-button class="btn btn-normal btn-column-set" size="mini" v-if="dataSalesItemList && dataSalesItemList.length > 0" @click="dialogColumnsSetting=true">列设置</el-button>
    <!--列设置弹窗 start-->
    <el-dialog
      title="列设置"
      :visible.sync="dialogColumnsSetting">
      <el-row class="el-checkall-wrapper">
        <el-checkbox @change="handleCheckAllChange">全选/取消</el-checkbox>
      </el-row>
      <el-checkbox-group :min="1" v-model="checkedConfigItmes">
        <el-checkbox v-for="(config, index) in configItmesAll"
                     :key="index"
                     :label="config.label"
                     :checked="config.className == 'show' ? true : false"
                     :disabled="config.disabled"
                     @change="handleCheckedConfigsChange($event, config)"
        >{{config.label}}
        </el-checkbox>
      </el-checkbox-group>
    </el-dialog>
    <!--列设置弹窗 end-->
  </span>
</template>
<script>
  export default {
    props: [
      'dataSalesItemList',
      'configItmesAll',
    ],
    data () {
      return {
        checkedConfigItmes: [],
        dialogColumnsSetting: false
      }
    },
    methods: {
      //列设置
      handleCheckedConfigsChange(e, config) {
        //选中表示列显示，取消列隐藏
        if (e && e == true) {
          config.className = 'show';//显示
        } else {
          config.className = 'hide';//隐藏
        }
      },

      //全选
      handleCheckAllChange(val) {
        let _this = this;
        let tempArr = [];//用来存储禁止选择的项
        this.configItmesAll.forEach((item, index) => {
          // debugger
          //全选：展示所有列，将所有勾选列加入到全局选中数组中
          if (val) {
            item.className = 'show';
            !_this.checkedConfigItmes.includes(item.label) && _this.checkedConfigItmes.push(item.label);//避免重复添加
          }
          // 如果有禁止操作：将禁止操作的列添加到临时数组中，再赋值给全局选中的数组(反向思路：只存禁止选中的列，避免取消全选时，禁止选中的列取消勾选)
          else {
            if (item.disabled == true) {
              item.className = 'show';
              tempArr.push(item.label);
            } else {
              item.className = 'hide';
            }
            _this.checkedConfigItmes = tempArr;
          }
        });
      },
    }
  }
</script>
