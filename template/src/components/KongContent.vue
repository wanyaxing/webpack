<template>
    <div class="kong_content_bg">
        <slot name="img">
            <img src="~@/assets/images/no.png"/>
        </slot>
        <div class="kong_content_div">
            <slot></slot>
        </div>
    </div>
</template>

<script>
// import HelloWorld from "./HelloWorld"

export default {
    name: 'KongContent',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.kong_content_bg{
    text-align: center;
    padding-top: 250px;
}
.kong_content_bg img{
    display: block;
    margin:0 auto;
    width: 230px;
}
.kong_content_bg .kong_content_div{
    padding-top: 44px;
    margin:0 auto;
    text-align: center;
    color:#8a8894;
    font-size: 30px;
    line-height: 36px;
}
</style>
