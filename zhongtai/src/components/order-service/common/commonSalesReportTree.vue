<template>
  <el-row class="input-group">
    <el-form-item label="销售部门：" v-if="positionLevel && positionLevel != 5">
      <el-button type="text" @click="showDialogTree()">请选择(默认全选)&nbsp;></el-button>
      <div class="departmentLists" v-if="checkedTreeItems && checkedTreeItems.length > 0">
          <span v-for="(item, index) in checkedTreeItems" :key="index">
            ，{{item}}
          </span>
      </div>
    </el-form-item>
    <!--选择全部销售部门弹窗 start-->
    <el-dialog title="销售部门" :visible.sync="dialogTree">
      <!--<el-input-->
        <!--size="mini"-->
        <!--placeholder="输入关键字搜索"-->
        <!--v-model="filterText"-->
        <!--class="el-input-tree"-->
        <!--@keyup.native="filterChange(filterText)">-->
      <!--</el-input>-->
      <div class="el-dialog__tree">
        <el-tree
          ref="tree"
          class="tree-group__item"
          :data="treeItems"
          show-checkbox
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[1, 2]"
          :default-checked-keys=checkedTreeKeys>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="hideDialogTree">确 定</el-button>
        </span>
    </el-dialog>
    <!--选择全部销售部门弹窗 end-->

  </el-row>
</template>

<script>
  import API from '@/api/order-service/salesReport'
  export default {
    data () {
      return {
        form: {
          salesOrgCode: '',
          storeCode: '',
          childStoreCodes: [],
          childRegioneIds: [],
          childBranchId1s: [],
          childBranchId2s: [],
        },
        filterText: '',
        treeItems: [],
        checkedTreeItems: [],
        checkedTreeKeys: [1],
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        dialogTree: false,
        positionLevel: 5,
        hasFilterText: false
      }
    },
    created() {
      this.__queryHierarchy();
      this.hideDialogTree();
    },
    mounted () {
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
        this.$refs.tree.setCheckedKeys([0])
      }
    },
    methods: {
      //查询销售部门
      __queryHierarchy() {
        let _this = this;
        //点击弹窗发送请求获取销售部门数据，发送一次请求即可
        API.queryHierarchy().then(response => {
          if (response) {
            const _res = response.response;
            this.positionLevel = _res.positionLevel;
            this.treeItems = [{
              label: '全部选择',
              id: 1,
              children: this.getTreeByOne(_res.gomeStoreFull)
            }];
          }
        });
      },
      getTreeByOne(data){
        let tree = this.getTree(data);
        return tree;
      },
      //处理后端数据：将扁平数组转换成树型结构
      getTree(arrs) {
        const tree = {}, ret = {};
        if (arrs && arrs.length > 0) {
          arrs.forEach((item, index) => {
            item.id = item.storeId;
            item.label = item.storeName;
            //初始化
            tree[item.regioneId] ? '' : tree[item.regioneId] = {};
            let tree1 = tree[item.regioneId];
            //一级节点
            tree1.id = item.regioneId;
            tree1.label = item.regioneName;

            //如果 没有二级节点
            tree1.children ? '' : tree1.children = {};
            if (!item.branchId1) {
              tree1.children[item.storeId] = item;
            } else {
              tree1.children[item.branchId1] ? '' : tree1.children[item.branchId1] = {};
              let tree2 = tree1.children[item.branchId1];
              tree2.id = item.branchId1;
              tree2.label = item.branchName1;
              tree2.children ? '' : tree2.children = {};
              tree2.children[item.storeId] = item;
            }
          });
          return this.treeToArray(tree);
        }
      },
      treeToArray(objs) {
        let arr = Object.getOwnPropertyNames(objs), _this = this;
        return arr.map(function (i) {
          const v = objs[i];
          if (v.children) {
            v.children = _this.treeToArray(v.children);
          }
          return v;
        });
      },
      //获取选择的部门
      getCheckedNodes() {
        //每次打开弹窗先将门店数组置空，选择了门店信息再赋值，避免选择了门店会重复向childStoreCodes添加id的问题
        this.form.childStoreCodes = [];
        let nodes = [];
        if (this.$refs.tree !== undefined) {
          nodes = this.$refs.tree.getCheckedNodes();
        }
        let oThis = this;
        let checkedNodes = [];
        nodes.forEach((v) => {
          if (v.storeId && v.storeId != null) {
            oThis.form.childStoreCodes.push(v.storeId);
          }
          if (v.storeName && v.storeName != undefined) {
            checkedNodes.push(v.storeName)
          }
        });
        //将重复的部门过滤
        this.checkedTreeItems = checkedNodes.filter(function(element,index,self){
          return self.indexOf(element) === index;
        });
      },

      //显示销售部门树型菜单
      showDialogTree () {
        this.dialogTree = true;
      },

      //关闭销售属性树形菜单
      hideDialogTree () {
        this.dialogTree = false;
        this.getCheckedNodes();
        //将获取到的id传给父组件，给查询时使用
        let data = {
          storeCodes: this.form.childStoreCodes,
          // regioneIds: this.form.childRegioneIds,
          // branchId1s: this.form.childBranchId1s,
          // branchId2s: this.form.childBranchId2s,
        };
        this.$emit('getSaleDepartmentsId',data);
      },
      //重置操作之后，通过key设置默认选中项
      setCheckedKeys() {
        let _this = this;
        this.$nextTick(() => {
          _this.$refs.tree && _this.$refs.tree.setCheckedKeys([1]);
        });
      },
      // filterChange:function (value) {
      //   this.$refs.tree.filter(value);
      // },
      // //条件搜索
      // filterNode(value, data, node) {
      //   if (!value) {
      //     return true;
      //   }
      //   return data.label.indexOf(value) !== -1;
      // }
    }
  }
</script>
