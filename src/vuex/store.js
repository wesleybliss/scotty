import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const debug = process.env.NODE_ENV !== 'production'

Vue.config.debug = debug

Vue.use( Vuex )

const state = {
    window: {
        normalSize: {
            width: 400,
            height: 300
        }
    },
    pendingFilePath: null
}

const store = new Vuex.Store({
    strict: debug,
    state,
    getters,
    actions,
    mutations,
})

export default store
