import Vuex from 'vuex'

const state = {
    loading: false
}

const mutations = {
    LOADING(state) {
        this.loading = !this.loading
    }
}

const actions = {
    loading(store) {
        store.dispatch('LOADING');
    }
}

export default new Vuex.Store({
	state,
	mutations,
	actions,
	strict: true
});