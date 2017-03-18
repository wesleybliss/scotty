import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
import { readSettings } from '../lib/settings'

const debug = process.env.NODE_ENV !== 'production'

Vue.config.debug = debug

Vue.use( Vuex )

let initialSettings = readSettings

const state = {
    settings: {
        accounts: {
            dropbox: {
                connected: false,
                clientId: null,
                auth: {}
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

try {
    state.settings.accounts.dropbox.clientId = initialSettings.accounts.dropbox.clientId || null
    state.settings.accounts.dropbox.auth = initialSettings.accounts.dropbox.auth || {}
}
catch ( e ) {}

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
