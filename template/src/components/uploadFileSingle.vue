<template>
    <div class="upload_file_single_bg" :style="{width:width+'px',height:height+'px'}">
        <div class="bg_filezone bg_attachment" v-for="(url,index) in urls" :key="url">
            <img class="img_preview" :src="'/ajax/file_relationships_view.php?file_name='+encodeURIComponent(url+'?imageMogr2/auto-orient/thumbnail/!'+width+'x'+height+'r/gravity/Center/crop/'+width+'x'+height+'')"/>
        </div>
        <InputUploadFile
                        class         = "bg_filezone bg_uploadzone"
                        :fileNumLimit = "1"
                        v-model       = "newFileUrl"
        >
            <div class="bg_new_file" v-if="urls.length==0">
                <img src="~@/assets/images/addition.png"/>
                <div>请选择图片上传</div>
            </div>
            <div v-else>
                <img src="~@/assets/images/add.png"/>
            </div>
        </InputUploadFile>
    </div>
</template>

<script>
import InputUploadFile from '@/components/InputUploadFile.vue'

export default {
    name: 'uploadFileSingle',
    components:{
        InputUploadFile,
    },
    props:{
        'value':{type:String},
        'width':{type:Number,default:100},
        'height':{type:Number,default:100},
    },
    data(){
        console.log('uploadFileSingle.vue.data()');
        return {
            newFileUrl    : null,
        }
    },
    computed:{
        urls:{
            get:function(){
                if (this.value)
                {
                    return this.value.split(',');
                }
                return [];
            },
            set:function(newValue){
                this.$emit('input',newValue.join(','));
            }
        },
    },
    methods:{
        removeUrl:function(index){
            this.urls.splice(index,1);
            this.urls = this.urls;
        }
    },
    watch:{
        newFileUrl:function(){
            if (this.newFileUrl)
            {
                this.urls = [this.newFileUrl];
                this.newFileUrl = null;
            }
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload_file_single_bg{
    position: relative;
}

.upload_file_single_bg .bg_filezone{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
}
</style>
