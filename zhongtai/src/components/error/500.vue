<template>
    <div class="error">
            <div class="err500"><img :src="img500"></div>
            <div class="errtext">抱歉，您访问的页面服务器繁忙...</div>
    </div>
</template>
<style>
.error{
    text-align: center;
}
.err500{
    width: 271px;
    height: 210px;
    margin: 15% auto 0;
}
.errtext{
        font-size: 16px;
    color: #555;
    margin: 40px 0 15px;
}
</style>
<script>
import img500 from '@/assets/images/500.jpg'
export default {
    data(){
        return {
            img500:img500
        }
    }
}
</script>





