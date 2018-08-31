<template>
    <div class="load_more_all_loaded_bg">
        \{{allLoaded?'--- 我是有底线的 ---':'--- 上拉加载更多 ---'}}
    </div>
</template>

<script>
// import HelloWorld from "./HelloWorld"

export default {
    name: 'LoadMoreAllLoaded',
    props:[
        'allLoaded',
    ],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.load_more_all_loaded_bg{
    text-align: center;
    padding: 20px 0;
}
</style>
