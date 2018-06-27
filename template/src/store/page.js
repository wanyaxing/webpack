
const state = {
    backText: null,
    backFn: null,
    title: null,
    moreText: null,
    moreFn: null,
    fromFullPath: null,
    isH5Mode: true,
    isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent),
    isDdtalk: /DingTalk/i.test(navigator.userAgent),
    isWxwork: /MicroMessenger/i.test(navigator.userAgent) && /wxwork/i.test(navigator.userAgent),
    isDevMode: window.location.host != 'm.jiyingshou.com' && window.location.host != 'dd.jiyingshou.com',
    dingtalk: null,
    $router: null,
    payload: null,
}

state.isWechat = !(state.isDdtalk || state.isWxwork ) && /MicroMessenger/i.test(navigator.userAgent);
if (state.isDevMode)//debug
{
    state.isWechat = true;
}
state.isH5Mode = !(state.isDdtalk || state.isWechat || state.isWxwork );

const actions = {
    pageUpdate({commit,state,dispatch}, payload={title:null,moreText:null,moreFn:null,backText:null,backFn:null,}) {
        console.log('pageUpdate',arguments);
        commit('pageUpdate',payload);
        if (state.isDdtalk)
        {
            dispatch('dingtalkUpdate');
        }
        else if (state.isWxwork)
        {
            // todod
        }
    },
    dingtalkUpdate({commit,state,dispatch}){
        if (state.dingtalk)
        {
            const dd = state.dingtalk.apis;
            dd.biz.navigation.setTitle({
                title: state.title?state.title:''
            });
            // dd.biz.navigation.setLeft({
            //     show: true, //控制按钮显示
            //     control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            //     android: true,//如果想让你注册的goBack客户端可以正常的触发，需要在设置setLeft时传control为true，而Android上需要传递 android 为true，这并不影响iOS。
            //     text: state.backText,//控制显示文本，空字符串表示显示默认文本
            //     onSuccess : function(result) {
            //         // dispatch('btnBack');
            //         // alert(result);
            //         // return function(){
            //         //     alert(result);
            //         //     console.log(xx);
            //         // }
            //     },
            //     onFail : (err)=> {}
            // });
            dd.biz.navigation.setRight({
                show: state.moreText?true:false,//控制按钮显示， true 显示， false 隐藏， 默认true
                control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
                text: state.moreText,//控制显示文本，空字符串表示显示默认文本
                android: true,//如果想让你注册的goBack客户端可以正常的触发，需要在设置setLeft时传control为true，而Android上需要传递 android 为true，这并不影响iOS。
                onSuccess : function(result) {
                    console.log('dd.biz.navigation.setRight onSuccess',this,arguments)
                    if (!state.isIOS)
                    {
                        // alert('dd.biz.navigation.setRight onSuccess');
                        dispatch('btnMore');
                    }
                },
                onFail : function(err) {}
            });
        }
    },
    historyBack(context){
        if (context.state.fromFullPath!=null)
        {
            if (context.state.dingtalk!=null)
            {
                console.log('dd goback');
                context.state.dingtalk.apis.biz.navigation.goBack({
                    onSuccess : function(result) {
                        /*result结构
                        {}
                        */
                    },
                    onFail : function(err) {}
                })
            }
            else
            {
                window.history.go(-1);
            }
        }
        else
        {
            window.history.go(-1);
            // window.location.href = '/';
        }
    },
    btnMore(context){
        if (typeof context.state.moreFn == 'function')
        {
            context.state.moreFn();
        }
        console.log(context.state.moreFn);
    },
    btnBack(context){
        if (typeof context.state.backFn == 'function')
        {
            if (context.state.backFn()!==false)
            {
                context.state.$router.go(-1);
            }
        }
        else
        {
            context.dispatch('historyBack');
        }
        console.log(typeof backFn);
    },
}


const mutations = {
    pageUpdate(state, payload={title:null,moreText:null,moreFn:null,backText:null,backFn:null,}) {
        state.payload  = payload;
        state.title    = payload.title;
        state.moreText = payload.moreText;
        state.moreFn   = payload.moreFn;
        state.backText = payload.backText;
        state.backFn   = payload.backFn;
        document.title = state.title;
    },
    pageFromFullPath(state, path='/'){
        state.fromFullPath = path;
    },
    dingtalkReady(state,dingtalk=null){
        state.isH5Mode = false;
        state.dingtalk = dingtalk;
    },
    routerInit(state,router=null){
        state.$router = router;
    },
}

const getters = {
}


export default {
    state,
    actions,
    mutations,
    getters,
}
