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
                .row
                    .col
                        h6 Dropbox
                        a.btn.btn-sm.btn-primary(:href="dropboxAuthUrl") {{ dropboxStatusText }}

</template>
