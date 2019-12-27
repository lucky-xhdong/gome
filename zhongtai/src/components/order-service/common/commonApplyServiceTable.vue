<template>
    <div class="common-table">
        <el-table
                :data="returnExchangeGoodsData.list">
            <el-table-column
                    v-for="(item, index) in configItmes"
                    :key="item.id"
                    :type=item.type
                    :prop=item.prop
                    :label=item.label>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <span v-if="LOGINDATA.orderplatform_applyServiceList_show">
                        <router-link tag="a" target="_blank" :to="{ path:'/order/serviceList_detail', query:{ returnRequestId: scope.row.returnRequestId }}" class="btn-normal" v-if="scope.row.showReturnRequestDetailButtonFlag && scope.row.showReturnRequestDetailButtonFlag == 'Y' && pageStatus == '1'">查看详情页</router-link>
                    </span>
                    <span v-if="LOGINDATA.orderplatform_applyServiceList_process">
                        <router-link tag="a" target="_blank" :to="{ path:'/order/applyService', query:{ returnRequestId: scope.row.returnRequestId, id: pageStatus }}" class="btn-normal" v-if="scope.row.showProcessReturnRequestButtonFlag && scope.row.showProcessReturnRequestButtonFlag == 'Y' && pageStatus == '2'">去处理</router-link>
                    </span>
                    <span v-if="LOGINDATA.orderplatform_applyServiceList_check">
                        <router-link tag="a" target="_blank" :to="{ path:'/order/serviceList_check', query:{ returnRequestId: scope.row.returnRequestId }}" class="btn-normal" v-if="scope.row.showAuditReturnRequestButtonFlag && scope.row.showAuditReturnRequestButtonFlag == 'Y' && pageStatus == '3'">去审核</router-link>
                    </span>
                    <span v-if="LOGINDATA.orderplatform_applyServiceList_cancelApply">
                        <a href='javascript:;' class="btn-normal" @click="showCancelConfirmDialog(scope.row)" v-if="scope.row.showCancelReturnRequestButtonFlag && scope.row.showCancelReturnRequestButtonFlag == 'Y'">取消申请</a>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                v-if="returnExchangeGoodsData.list && returnExchangeGoodsData.list.length > 0 && returnExchangeGoodsData.pager"
                @current-change="handleCurrentChange"
                background
                :current-page="returnExchangeGoodsData.pager.currentPage"
                :page-size="returnExchangeGoodsData.pager.pageSize"
                layout="total, prev, pager, next"
                :total="returnExchangeGoodsData.pager.totalSize">
        </el-pagination>
        <!--是否确认提交退换货申请/处理 start-->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>确定取消该订单吗?</span>
          <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="dialogVisible = false">不取消了</el-button>
              <el-button size="mini" type="primary" @click="cancelReturnRequest(returnRequestItem)">确定取消</el-button>
          </span>
        </el-dialog>
        <!--是否确认提交退换货申请/处理 end-->
    </div>
</template>
<script>
    import { mapState } from "vuex";
    import API from '@/api/order-service/applyService';
    export default {
        props: {
            returnExchangeGoodsData:{
                type: Object
            },
        },
        //vuex取值
        computed: mapState({
            LOGINDATA: "LOGINDATA"
        }),
        data() {
            return {
                pageStatus: '',
                dialogVisible: false,
                configItmes: [
                    {label:"序号", type: "index"},
                    {label:"退换货号", prop: "returnRequestId"},
                    {label:"订单号", prop: "orderId"},
                    {label:"配送单号", prop: "shipId"},
                    {label:"商品编码", prop: "skuNo"},
                    {label:"商品名称", prop: "prodName"},
                    {label:"会员卡号", prop: "memberCardNo"},
                    {label:"商品实付金额", prop: "prodPayAmount"},
                    {label:"商品退回方式", prop: "returnShipMethodDesc"},
                    {label:"申请退换货时间", prop: "submitReturnRequestDateTime"},
                    {label:"申请终端", prop: "invokeFrom"},
                    {label:"申请人编号", prop: "submitterId"},
                    {label:"申请人姓名", prop: "submitterName"},
                    {label:"申请人岗位", prop: "submitterRole"},
                    {label:"服务单状态", prop: "returnRequestState"}
                ],
              returnRequestId: '',
              returnRequestItem:[]
            }
        },
        created () {
            this.pageStatus = this.$route.params.id;
        },
        methods: {
          //当前页点击操作
          handleCurrentChange(val) {
            this.$emit("handleSearchByPage",val);
          },
          showCancelConfirmDialog(item){
              this.dialogVisible = true;
              this.returnRequestItem = item;
          },
          cancelReturnRequest (item) {
            let params = {
              returnRequestId: item.returnRequestId,
              cancelReasonCode:'',
              cancelReasonRemark:''
            };
            let _this = this;
            API.cancelReturnRequest(params).then(response=>{
              //取消成功：弹层关闭，列表刷新，按钮隐藏
              if (response.success) {
                //取消成功之后将订单状态改成已取消，按钮显示标识改为N，以防接口有延时问题，不能即时更新数据状态
                item.showCancelReturnRequestButtonFlag = 'N';
                item.returnRequestState = '已取消';
                _this.$message.success("取消成功！");
                setTimeout(() =>  {
                  _this.$emit('queryReturnRequestList', 1);//1是页码，当前页
                }, 1000);
                _this.dialogVisible = false;
              }
              else {
                //状态变更：提示状态变更，列表刷新，按钮隐藏
                if (response.respCode == '503') {
                  item.showCancelReturnRequestButtonFlag = 'N';
                  item.returnRequestState = '已取消';
                  _this.$message.error(response.respMsg);
                  setTimeout(() =>  {
                    _this.$emit('queryReturnRequestList', 1);//1是页码，当前页
                  }, 1000);
                  _this.dialogVisible = false;
                }
                //取消失败：弹层关闭，按钮展示
                else if(response.respCode == '500') {
                  _this.$message.error(response.respMsg);
                  _this.dialogVisible = false;
                }
              }
            });
          },
          handleClose() {
            this.dialogVisible = false;
          },
        }
    }
</script>
