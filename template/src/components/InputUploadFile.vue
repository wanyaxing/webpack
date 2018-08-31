<template>
    <form class="input_upload_file_bg" >
        <div v-show="fileNumLimit>0">
            <label>
                <input
                        type="file"
                        @change="uploadFile"
                        ref="inputFiler"
                        :accept="accept"
                />
                <slot>选择文件</slot>
            </label>
        </div>
        <div v-if="fileNumLimit==0">
            文件数量已达最大值，不可添加新文件。
        </div>
        <div v-if="isUploading" class="bg_uploading">
            <div class="info_uploading">
                上传中\{{progress}}%...
            </div>
        </div>
    </form>
</template>

<script>

export default {
    name: 'InputUploadFile',
    components:{
        // KongContent,
    },
    props:{
        value:{
            type: String,
            required: false,
        },
        fileNumLimit:{
            type: Number,
            default: 0,
        },
        accept:{
            type: String,
            default: 'image/jpeg,image/gif,image/png'
        },
    },
    data(){
        return {
            progress:0,
            isUploading:false,
        }
    },
    computed:{
    },
    methods:{
        onPercent:function(percent){
            this.progress = percent;
        },
        uploadFile:function(e){
            let inputDOM = this.$refs.inputFiler;
            console.log(inputDOM.files,inputDOM);
            if (inputDOM.files && inputDOM.files.length>0)
            {
                this.isUploading = true;
                this.progress = 0;
                let sequence = Promise.resolve();
                for (var i = 0; i < this.fileNumLimit && i < inputDOM.files.length; i++) {
                    let file = inputDOM.files[i];
                    this.total += 100;
                    sequence = sequence.then(()=>{
                        return this.$haoconnect.uploadFileToQiniu(file,this.onPercent).then(hResult=>{
                            this.$emit('input',hResult.find('urlPreview'));
                            this.$emit('preview',hResult.find('urlDownload'));
                            this.$el.reset();
                        });
                    });
                }
                sequence.finally(()=>{
                    this.isUploading = false;
                }).catch(hResult=>{console.error(hResult);alert(hResult && hResult.errorStr?hResult.errorStr:hResult)});
            }
        },
        updateIfMultiple:function(){
            if (this.fileNumLimit>1)
            {
                this.$refs.inputFiler.setAttribute('multiple','multiple');
            }
            else if (this.fileNumLimit==1)
            {
                this.$refs.inputFiler.removeAttribute('multiple');
            }
        }
    },
    watch:{
        fileNumLimit:function(){
            this.updateIfMultiple();
        },
    },
    mounted:function(){
        console.log('InputUploadFile.vue.mounted',arguments);
        this.updateIfMultiple();
    },
    activated:function(){
        console.log('InputUploadFile.vue.activated',arguments);
        this.updateIfMultiple();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input_upload_file_bg{
    position: relative;
}
.input_upload_file_bg label {
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 10; /* 这个z-index之后说到*/
}
.input_upload_file_bg label input{
    display: none;
}

.bg_uploading{
    width: 100%;
    height: 100%;
    position: relative;
    background-color: white;
    z-index: 10;
}
.info_uploading{
    position: absolute;
    text-align: center;
    width: 100%;
    top:50%;
    font-size: 14px;
    line-height: 14px;
    margin-top:-7px;
}
</style>
