<template>
    <div class="input_upload_image_bg" >
        <div v-show="fileNumLimit>0">
            <label>
                <input
                        type="file"
                        @change="choseFile"
                        ref="inputFiler"
                        accept="image/*"
                />
                <slot>选择文件</slot>
            </label>
        </div>
        <div v-if="fileNumLimit==0">
            文件数量已达最大值，不可添加新文件。
        </div>
        <div v-show="isUploading" class="bg_uploading">
            <div class="info_uploading">
                {{percent}}%
            </div>
        </div>
        <VueCropperModel v-if="isShowCropBg" :value="imgFile" v-show="isShowCropBg" :isShowCropBg.sync="isShowCropBg" v-bind="$attrs" v-on="$listeners" @cropped="uploadBlob"/>
    </div>
</template>

<script>
import VueCropperModel from "@/components/VueCropperModel.vue"

export default {
    name: 'InputUploadImage',
    components:{
        VueCropperModel,
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
    },
    data(){
        return {
            percent:0,
            isUploading:false,
            imgFile:null,
            isShowCropBg:false,
        }
    },
    computed:{
    },
    methods:{
        onProgress:function(progress){
            this.percent = progress.percent;
        },
        choseFile:function(e){
            //上传图片
            var file = e.target.files[0]
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                 alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                 return false
             }
            var reader = new FileReader();
            reader.onload = (e) => {
                let data
                if (typeof e.target.result === 'object')
                {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]));
                }
                else
                {
                    data = e.target.result;
                }
                this.imgFile = data;
                this.isShowCropBg = true;
            }
            // 转化为base64
            // reader.readAsDataURL(file)
            // 转化为blob
            reader.readAsArrayBuffer(file);
        },
        uploadBlob:function(data){
            this.isUploading = true;
            this.percent = 0;
            let sequence = Promise.resolve();
            let file = data;
            file.lastModifiedDate = new Date();
            let inputDOM = this.$refs.inputFiler;
            if (inputDOM.files && inputDOM.files.length>0)
            {
                file.name = inputDOM.files[0].name;
            }
            else
            {
                file.name = 'crop.'+(new Date().getTime())+'.jpg';
            }
            this.total += 100;
            sequence = sequence.then(()=>{
                return this.$haoconnect.uploadFileToQiniu(file,this.onProgress).then(hResult=>{
                    this.$emit('input',hResult.find('urlPreview'));
                    this.$emit('preview',hResult.find('urlDownload'));
                    if (this.$refs.inputFiler)
                    {
                        this.$refs.inputFiler.value='';
                    }
                });
            });
            sequence.then(()=>{
                this.isUploading = false;
            }).catch(hResult=>{this.isUploading = false;console.error(hResult);alert(hResult && hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input_upload_image_bg{
    position: relative;
}
.input_upload_image_bg label {
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 10; /* 这个z-index之后说到*/
}
.input_upload_image_bg label input{
    display: none;
}

.bg_uploading{
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: white;
    z-index: 10;
    left: 0;
    top: 0;
    pointer-events: none;
}

.info_uploading{
    position: absolute;
    text-align: center;
    width: 100%;
    top:50%;
    font-size: 14px;
    line-height: 14px;
    margin-top:-7px;
    text-shadow: 0 0 3px white;
}

</style>
