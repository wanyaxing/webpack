export default {
    name: 'HaoTemp',
    props: [
        'urlParam',
        'params',
    ],

    data: () => ({
        requestResult : null,
        error : null,
    }),

    computed:{
        paramsToString(){
            // console.log('HaoTemp.paramsToString()');
            return JSON.stringify([this.urlParam,this.params]);
        },
    },

    render (h) {
        // console.warn('HaoTemp.render',this._uid);
        if (this.error && this.$scopedSlots.error) {
            return this.$scopedSlots.error(this.error);
        } else if (this.requestResult && this.$scopedSlots.default) {
            return this.$scopedSlots.default(this.requestResult)
        } else if (this.$slots.default && this.$slots.default.length>0){
            return this.$slots.default[0]
        }
    },

    mounted:function(){
        // console.warn('HaoTemp.mounted',this._uid,this);
        this.loadContent();
    },

    watch:{
        paramsToString:function(){
            this.loadContent();
        },
    },

    methods:{
        loadContent:function(){
            // return false;
            if (this._loadContent)
            {
                this._loadContent.abort();
            }
            this._loadContent = this.$haoconnect.get(this.urlParam,this.params).then(hResult=>{
                this.requestResult = hResult;
            }).catch(hResult=>{
                this.error = hResult.errorStr?hResult.errorStr:hResult;
            });
        },
    },

    beforeDestroy:function(){
        // console.warn('beforeDestroy',this._uid,this._loadContent,this._loadContent.status());
        if (this._loadContent)
        {
            this._loadContent.abort();
        }
    },
}
