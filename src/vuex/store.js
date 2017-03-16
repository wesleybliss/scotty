import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

const debug = process.env.NODE_ENV !== 'production'

Vue.config.debug = debug

Vue.use( Vuex )

const state = {
    settings: {
        accounts: {
            dropbox: {
                connected: false
            }
        }
    },
    window: {
        normalSize: {
            width: 400,
            height: 300
        }
    },
    pendingFilePath: null
}

export default new Vuex.Store({
    strict: debug,
    state,
    getters,
    actions,
    mutations,
    plugins: [
        createPersistedState({
            paths: [
                'settings'
            ]
        })
    ]
})
