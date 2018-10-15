<template>
    <div class="vue_cropper_model_bg" >
        <vueCropper
          ref="cropper"
          :img="value"
          :autoCrop="true"
          :fixedBox="true"
          :autoCropWidth="width"
          :autoCropHeight="height"
          :canMoveBox="false"
          :original="true"
          :centerBox="true"
          :infoTrue="false"
        ></vueCropper>
        <div class="btns_action">
            <div @click="hide">取消</div>
            <div @click="crop">确定</div>
        </div>
    </div>
</template>

<script>
import VueCropper from 'vue-cropper'

export default {
    name: 'VueCropperModel',
    components:{
        VueCropper,
    },
    props:{
        value:{
            type: String,
            required: false,
        },
        width:{
            type: Number,
            default: 250,
        },
        height:{
            type: Number,
            default: 250,
        },
    },
    data(){
        return {
        }
    },
    computed:{
    },
    methods:{
        hide:function(){
            this.$emit('update:isShowCropBg',false);
        },
        crop:function(){
            this.$refs.cropper.getCropBlob((data) => {
                this.$emit('cropped',data);
                this.$emit('update:isShowCropBg',false);
            });
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
                sequence.then(()=>{
                    this.isUploading = false;
                }).catch(hResult=>{this.isUploading = false;console.error(hResult);alert(hResult && hResult.errorStr?hResult.errorStr:hResult)});
            }
        },
    },
    mounted() {
        document.body.appendChild(this.$el);
        document.body.classList.add('body-prevent-class');
        this.$emit('open');
    },
    destroyed() {
        if (document.body.classList.contains('body-prevent-class')) {
            document.body.classList.remove('body-prevent-class');
            /*document.body.removeEventListener('touchmove', preventEventFun, {
                passive: false
            });*/
        }
        if (this.$el.parentNode)
        {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.$emit('closed');
    },
}
</script>

<style>
.body-prevent-class {
    overflow: hidden;
}
.body-prevent-class {
    touch-action: none;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vue_cropper_model_bg{
    position: fixed;
    /*top: 0;*/
    /*right: 0;*/
    bottom:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    user-select: none;
    -moz-user-select: none;
    padding-bottom: 90px;
}

.btns_action {
    position: absolute;
    bottom: 0;
    text-align: center;
    width:100%;
}
.btns_action > div{
    width: 49%;
    line-height: 90px;
    display: inline-block;
}
.btns_action > div:nth-child(2){
    border-left: 1px solid #bbbbbb;
}
</style>
