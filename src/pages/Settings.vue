<script>

//import router from '../lib/router'
import { mapGetters } from 'vuex'
import { remote } from 'electron'
import { dropbox } from '../lib/dropbox'

export default {
    name: 'Settings',
    data: () => {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        }),
        dropboxIsEnabled() {
            return process.env.SCOTTY_DB_CLIENT_KEY
                && process.env.SCOTTY_DB_CLIENT_KEY.length > 0
        },
        dropboxPartiallyConnected() {
            return Object.keys( this.settings.accounts.dropbox.auth ).length > 0
        },
        dropboxStatusText() {
            return this.settings.accounts.dropbox.connected
                ? 'Disconnect' : 'Connect'
        },
        dropboxAuthUrl() {
            return dropbox.getAuthenticationUrl(
                'http://localhost:8080/settings/connect/dropbox' )
        }
    },
    methods: {
        completeDropboxSetup() {
            window.alert( JSON.stringify( this.settings.accounts.dropbox.auth, null, '    ' ) )
        }
    },
    mounted() {
        
        remote.getCurrentWindow().setFullScreen( false )
        
    }
}

</script>

<template lang="pug">

#page-settings
    
    .container-fluid: .row: .col-12.pt-3
        
        .row
            .col
                h4 Settings
        
        .row
            .col
                h5 Accounts
                
                .row(v-if="dropboxIsEnabled")
                    .col
                        h6 Dropbox
                        a.btn.btn-sm.btn-primary(:href="dropboxAuthUrl")
                            | {{ dropboxStatusText }}
                        button.btn.btn-sm.btn-success(v-if="dropboxPartiallyConnected", @click="completeDropboxSetup")
                            | Complete Setup
    
    footer.footer
        .container-fluid: .row
            .col
                router-link(to="/").btn.btn-secondary &larr; Home

</template>
