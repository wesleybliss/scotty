<script>

import { mapGetters, mapActions } from 'vuex'
import { readSettings, writeSettings } from '../lib/settings'
import { remote } from 'electron'
import { dropbox } from '../lib/dropbox'

export default {
    name: 'Settings',
    data: () => {
        return {
            dropboxClientId: null
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        }),
        loadedSettings() {
            return readSettings()
        },
        dropboxPartiallyConnected() {
            return Object.keys( this.settings.accounts.dropbox.auth ).length > 0
        },
        dropboxStatusText() {
            return this.settings.accounts.dropbox.connected
                ? 'Disconnect' : 'Connect'
        },
        dropboxAuthUrl() {
            try {
                return dropbox.getAuthenticationUrl(
                    'http://localhost:8080/settings/connect/dropbox' )
            }
            catch ( e ) {
                return ''
            }
        }
    },
    methods: {
        ...mapActions([ 'setDropboxClientId' ]),
        saveSettings() {
            writeSettings( this.settings )
        },
        doSetDropboxClientId() {
            console.log('setDropboxClientId', this.dropboxClientId)
            this.setDropboxClientId( this.dropboxClientId )
            dropbox.clientId = this.dropboxClientId
            //writeSettings( )
        },
        completeDropboxSetup() {
            window.alert( JSON.stringify( this.settings.accounts.dropbox.auth, null, '    ' ) )
        }
    },
    mounted() {
        
        try {
            this.dropboxClientId = this.loadedSettings.accounts.dropbox.clientId
            console.log( this.dropboxHasClientId() )
        }
        catch ( e ) {}
        
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
                //- div: pre: code {{ JSON.stringify( settings, null, '    ' ) }}
        
        .row
            .col
                h5 Accounts
                
                .row
                    .col
                        h6 Dropbox
                        .form-group(v-if="!dropboxClientId || true")
                            .row
                                .col
                                    input.form-control(type="text", v-model="dropboxClientId", placeholder="Client ID")
                                .col
                                    button.btn.btn-success.ml-2(@click="doSetDropboxClientId") Set
                        a.btn.btn-sm.btn-primary(v-if="dropboxClientId", :href="dropboxAuthUrl")
                            | {{ dropboxStatusText }}
                        //- button.btn.btn-sm.btn-success(v-if="dropboxPartiallyConnected", @click="completeDropboxSetup")
                        //-     | Complete Setup
    
    footer.footer
        .container-fluid: .row
            .col
                router-link(to="/").btn.btn-secondary &larr; Home
            .col.text-right
                button.btn.btn-primary(@click="saveSettings") Save

</template>
