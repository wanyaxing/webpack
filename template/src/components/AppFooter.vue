<template>
    <div class="app-footer">
        <div class="nav-ul">
            <div class="nav-li" v-bind:class="classOfCount" v-for="item in items">
                <div class="nav-heading">
                    <router-link :to="item['path']" >
                        <img class="default" v-bind:src="item['iconDefault']"/>
                        <img class="active" v-bind:src="item['iconActive']"/>
                        <div>\{{item.title}}</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import orderBy from 'lodash/orderBy';


export default {
    name: 'AppFooter',
    props:[
    ],
    data () {
        return {}
    },
    computed:{
        items:function(){
            var items = [];

            items.push({
                    'rank'        :1,
                    'title'       :'首页',
                    'path'        :'/hello',
                    'iconDefault' :require('@/assets/images/tab/homepage.png'),
                    'iconActive'  :require('@/assets/images/tab/homepage-fill.png'),
                });
            items.push({
                    'rank'        :2,
                    'title'       :'列表',
                    'path'        :'/list',
                    'iconDefault' :require('@/assets/images/tab/jys.png'),
                    'iconActive'  :require('@/assets/images/tab/jysc.png'),
                });

            items.push({
                    'rank'        :3,
                    'title'       :'我的',
                    'path'        :'/wode',
                    'iconDefault' :require('@/assets/images/tab/jys.png'),
                    'iconActive'  :require('@/assets/images/tab/jysc.png'),
                });

            return items;
        },
        classOfCount:function(){
            return {
                navs_count_1:this.items.length==1,
                navs_count_2:this.items.length==2,
                navs_count_3:this.items.length==3,
                navs_count_4:this.items.length==4,
                navs_count_5:this.items.length==5,
                navs_count_6:this.items.length==6,
                navs_count_7:this.items.length==7,
                navs_count_8:this.items.length==8,
                navs_count_9:this.items.length==9,
                navs_count_10:this.items.length==10,
                navs_count_11:this.items.length==11,
                navs_count_12:this.items.length==12,
            }
        },
    },
    // methods:{
    //     checkIfMenus:function(item){
    //         console.log(item.childs.length>0 && (item.childs.length>1 || item.childs[0]['name']!=item['name']));
    //         return item.childs.length>0 && (item.childs.length>1 || item.childs[0]['name']!=item['name']);
    //     }
    // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-footer{
    position: fixed;
    width: 750px;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    right: 0;
    z-index: 99;
    text-align: center;
    padding: 0;
    border-top: 1px solid #d0d0d0;
}
.app-footer .nav-li{
    float: left;
    margin-top: 0;
    width: 25%;
    border-radius: 0;
    background-color: white;
}
.app-footer .nav-li .nav-heading{
    white-space: nowrap;
    overflow: hidden;
    padding: 0;
}
.nav-heading a{
    color: #505050;
}
.app-footer .nav-heading a.router-link-active{
    color: #08b2f2;
}
.nav-heading img{
    display: none;
    margin: 0 auto;
    width: 51px;
}
.nav-heading img.default{
    display: block;
}
.nav-heading .router-link-active img.active{
    display: block;
}
.nav-heading .router-link-active img.default{
    display: none;
}

.app-footer .navs_count_1{width: 100%;}
.app-footer .navs_count_2{width: 50%;}
.app-footer .navs_count_3{width: 33.33%;}
.app-footer .navs_count_4{width: 25%;}
.app-footer .navs_count_5{width: 20%;}
.app-footer .navs_count_6{width: 16.66%;}
.app-footer .navs_count_7{width: 14.28%;}
.app-footer .navs_count_8{width: 12.50%;}
.app-footer .navs_count_9{width: 11.11%;}
.app-footer .navs_count_10{width: 10%;}
.app-footer .navs_count_11{width: 9.09%;}
.app-footer .navs_count_12{width: 8.33%;}


.app-footer .nav-li .nav-group{
        position: absolute;
        bottom: 100%;
        width: 25%;
        display: none;
        border: 1px solid #cecece;
}

.app-footer .nav-li:last-child .nav-group,.app-footer .navs_count_10:nth-last-child(2) .nav-group,.app-footer .navs_count_11:nth-last-child(2) .nav-group,.app-footer .navs_count_12:nth-last-child(2) .nav-group{
        right: 0;
}

.app-footer .navs_count_12:nth-last-child(2) .nav-group{
        right: 0;
}

.app-footer .navs_count_1 .nav-group{
    width: 100%;
}

.app-footer .navs_count_2 .nav-group{
    width: 50%;
}

.app-footer .navs_count_3 .nav-group{
    width: 33.33%;
}

.app-footer .nav-li .nav-group a{
    border-radius: 0;
}

.app-footer .nav-heading a{
    padding: 9px 0;
    border: 0;
    font-size: 20px;
    display: block;
}
</style>
