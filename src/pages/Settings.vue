<script>

import { mapGetters, mapActions } from 'vuex'
import { readSettings, writeSettings } from '../lib/settings'
import { remote } from 'electron'
import { dropbox } from '../lib/dropbox'

export default {
    name: 'Settings',
    data: () => {
        return {
            dropboxAccessToken: null
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        }),
        loadedSettings() {
            return readSettings()
        }
    },
    methods: {
        ...mapActions([ 'setDropboxAccessToken' ]),
        saveSettings() {
            writeSettings( this.settings )
        },
        doSetDropboxAccessToken() {
            this.setDropboxAccessToken( this.dropboxAccessToken )
            dropbox.accessToken = this.dropboxAccessToken
            this.saveSettings()
        }
    },
    mounted() {
        
        remote.getCurrentWindow().setFullScreen( false )
        
        this.dropboxAccessToken = this.loadedSettings.accounts.dropbox.accessToken
        console.log('ladasdad', this.loadedSettings.accounts.dropbox.accessToken)
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
                
                .row
                    .col
                        h6 Dropbox
                        .form-group(v-if="!dropboxAccessToken || true")
                            .row
                                .col
                                    input.form-control(type="text", v-model="dropboxAccessToken", placeholder="Access Token")
                                .col
                                    button.btn.btn-success.ml-2(@click="doSetDropboxAccessToken") Set
                        router-link.btn.btn-sm.btn-primary(v-if="dropboxAccessToken", to="/settings/connect/dropbox")
                            | Connect
                        //- button.btn.btn-sm.btn-success(v-if="dropboxPartiallyConnected", @click="completeDropboxSetup")
                        //-     | Complete Setup
    
    footer.footer
        .container-fluid: .row
            .col
                router-link(to="/").btn.btn-secondary &larr; Home
            .col.text-right
                button.btn.btn-primary(@click="saveSettings") Save

</template>
