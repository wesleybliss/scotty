<script>

import { mapGetters, mapActions } from 'vuex'
import { dropbox, testApi } from '../lib/dropbox'

export default {
    name: 'DropboxConnect',
    data: () => {
        return {
            error: null,
            testResult: null
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        })
    },
    methods: {
        ...mapActions([ 'setDropboxAuth' ]),
        runTestApi() {
            dropbox.filesListFolder({ path: '' })
                .then( response => {
                    console.log( response )
                    this.testResult = true
                })
                .catch( err => {
                    console.error( err )
                    this.testResult = false
                })
        }
    },
    mounted() {
        
        // After the user has authorized your app, they’ll be sent
        // to your redirect URI, with a few query parameters:
        // https://www.example.com/mycallback?code=<authorization code>&state=<CSRF token>
        
        if ( !window.location.hash || window.location.hash.indexOf( '&' ) < 1 ) {
            this.error = 'No authorization was found in the response.'
            return
        }
        
        let dropboxResponse = {}
        
        window.location.hash.substring(1).split('&').forEach( x => {
            let [ key, val ] = x.split('=')
            dropboxResponse[key] = val
        })
        
        this.setDropboxAuth( dropboxResponse )
        
        console.log( 'Dropbox response', dropboxResponse )
        
        dropbox.accessToken = dropboxResponse.access_token
        
    }
}

</script>

<template lang="pug">

#page-dropbox-connect
    
    .container-fluid: .row: .col-12.pt-3
        
        .row
            .col
                h4 Dropbox Connect
        
        .row(v-if="settings.accounts.dropbox.auth")
            .col
                pre: code {{ JSON.stringify( settings.accounts.dropbox.auth, null, '    ' ) }}
        
        .row(v-if="error")
            .col
                p There was an error connecting to your Dropbox account.
                i {{ error }}
        
        .row(v-if="!error")
            .col
                h6 Connected to Dropbox!
                p Now let's do a test call to make sure it worked.
                button.btn.btn-primary(@click="runTestApi") Test
        
        .row(v-if="!error && (testResult === true || testResult === false)")
            .col
                p: b Test Result: {{ testResult ? 'Success' : 'Failed' }}
        
    footer.footer
        .container-fluid: .row
            .col
                router-link(to="/settings").btn.btn-secondary &larr; Settings

</template>
