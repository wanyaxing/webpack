import HaoConnect from '../lib/HaoConnect/HaoConnect.js'


const state = {
    currentUser: null,
    loginFailed:false,
}

const actions = {
    // The first argument is the vuex store, but we're using only the
    // dispatch function, which applies a mutation to the store,
    // and the current state of the store
    get_my_detail ({commit, state}) {
        return HaoConnect.get('user/get_my_detail').then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        }).catch(hResult=>{
            commit('loginFailed',hResult) ;
            return hResult;
        });
    },
    login ({commit, state},params) {
        console.log(state.currentUser,params);
        return HaoConnect.post('user/login',params).then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        });
    },
    unionLogin ({commit, state},params) {
        console.log(state.currentUser,params);
        return HaoConnect.post('user/union_login',params).then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        });
    },
    bindLogin ({commit, state},params) {
        console.log(state.currentUser,params);
        return HaoConnect.post('user/bind_login',params).then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        });
    },
    createCompanyForDD ({commit, state},params) {
        console.log(state.currentUser,params);
        return HaoConnect.post('user/create_company_for_d_d',params).then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        });
    },
    createCompanyForWxwork ({commit, state},params) {
        console.log(state.currentUser,params);
        return HaoConnect.post('user/create_company_for_wxwork',params).then(hResult=>{
            commit('setCurrentUser',hResult) ;
            return hResult;
        });
    },
    logout ({commit, state}) {
        return HaoConnect.post('user/log_out').then(hResult=>{
            commit('setCurrentUser',null) ;
            window.history.go(0);
            return hResult;
        });
    }
}


const mutations = {
    setCurrentUser (state, hResult) {
        state.currentUser = hResult;
    },
    loginFailed (state, hResult) {
        state.loginFailed = true;
    },

}

const getters = {
    cartProducts (state, getters, rootState) {

    },

}
export default {
    state,
    actions,
    mutations,
    getters,
}
