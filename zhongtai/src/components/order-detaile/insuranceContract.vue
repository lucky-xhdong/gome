<template>
    <div>
        
        <ul class="tabbox">
            <li v-for="(item,key) in response" :key="item.id"  :class="{active:key == num}" @click="tab(key)">{{item.contractNo}}</li>
        </ul>
        <div class="tabCon">
            <div v-for="(item,key) in response" :key="item.id" v-if=" key == num">
                <iframe width="100%" :height="clientHeight" :src="item.agreementPdfUrl" frameborder="0"></iframe>
            </div>
        </div>
    </div>  
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import API from "@/api/orderDetail/orderdetails";
    export default {
        data() {
            return {
                num: 0,
                response:[],
                clientHeight: document.documentElement.clientHeight - 100,
                clientHeight1: document.documentElement.clientHeight - 50,
            };
        },
        methods: {
            tab(index) {
                this.num = index;
            },
            getData(index){
                let that =this;
                let parms ={
                    shippingGroupId:this.$route.query.shippingGroupId,
                    commerceItemId:this.$route.query.commerceItemId
                }
                API.cheackInsurance(parms).then(function(data) {
                    if (data.success) {
                        that.response=data.response;   
                    } else {
                        that.$message({
                        message: data.respMsg,
                        type: "error"
                        });
                    }
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapState({
            //vuex取值
            LOGINDATA: "LOGINDATA"
            })
        },
    };
</script>
<style>
.tabbox{
    height: 32px;
    overflow: hidden;
}
.tabCon{
    margin-top:10px;
}
.tabbox li{
    float: left;
    height:30px;
    padding:0 15px;
    border-bottom:2px solid #e4e7ed;
    cursor: pointer;
}
.tabbox li.active{
    border-bottom:2px solid #409eff;
}
</style>
