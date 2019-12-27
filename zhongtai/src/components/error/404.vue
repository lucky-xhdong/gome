<template>
    <div class="error">
            <div class="err404"><img :src="img404"></div>
            <div class="errtext">抱歉，您访问的页面不存在</div>
    </div>
</template>
<style>
.error{
    text-align: center;
}
.err404{
    width: 271px;
    height: 135px;
    margin: 15% auto 0;
   
}
.errtext{
        font-size: 16px;
    color: #555;
    margin: 40px 0 15px;
}
</style>

<script>
import img404 from '@/assets/images/404.jpg'
export default {
    data(){
        return {
            img404:img404
        }
    }
}
</script>





