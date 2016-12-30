import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    loading: false,
    userinfo: {
        username: '',
        password: ''
    }
}

const getters = {

}

const mutations = {
    User(state, user) {
        state.userinfo = user
    },
    LOADING(state) {
        this.loading = !this.loading
    }
}

const actions = {
    setUser({commit}, user) {
        commit('User', user)
    },
    loading({commit}) {
        commit('LOADING')
    }
}

export default new Vuex.Store({
	state,
    getters,
	mutations,
	actions,
	strict: true
});