<script>

import { mapGetters, mapActions } from 'vuex'
import { writeSettings } from '../lib/settings'
import { dropbox, testApi } from '../lib/dropbox'

export default {
    name: 'DropboxConnect',
    data: () => {
        return {
            error: null,
            testResult: null,
            logMessages: []
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        })
    },
    methods: {
        ...mapActions([ 'setDropboxAuth' ]),
        log( ...args ) {
            this.logMessages.push( args.map( a => JSON.stringify( a ) ).join(' ') )
        },
        runTestApi() {
            this.log( 'Checking Dropbox access token' )
            this.log( '...', dropbox.accessToken )
            if ( !dropbox.accessToken ) {
                return this.log( '... Error', 'missing access token!' )
            }
            else {
                this.log( '... OK' )
            }
            this.log( 'Fetching list of folders' )
            dropbox.filesListFolder({ path: '' })
                .then( response => {
                    this.log( 'Response', response )
                    console.log( response )
                    this.testResult = true
                })
                .catch( err => {
                    this.log( 'Error', err )
                    console.error( err )
                    this.testResult = false
                })
        }
    },
    mounted() {
        
        window.onerror = function() {
            this.log( 'error', arguments )
        }.bind( this )
        
        this.runTestApi()
    }
}

</script>

<template lang="pug">

#page-dropbox-connect
    
    .container-fluid: .row: .col-12.pt-3
        
        .row
            .col
                h4 Dropbox Connect
        
        .row(v-if="!error && (testResult !== true || testResult !== false)")
            .col
                p Testing your Dropbox connection, please wait...
        
        .row(v-if="error")
            .col
                p There was an error connecting to your Dropbox account.
                i {{ error }}
        
        .row(v-if="!error && (testResult === true || testResult === false)")
            .col
                div.alert.alert-danger(v-if="testResult === false", role="alert")
                    b Test failed.&nbsp;
                    span You're Dropbox account was not connected.
                div.alert.alert-success(v-if="testResult === true", role="alert")
                    b Test succeeded!&nbsp;
                    span You're Dropbox account is now connected.
                button.btn.btn-secondary(@click="runTestApi") Test Again
                router-link.btn.btn-secondary.ml-2(tag="button", to="/settings") Back to Settings
        
        .row
            .col
                ul.list-group
                    li.list-group-item(v-for="m in logMessages")
                        pre: code {{ m }}
        
    footer.footer
        .container-fluid: .row
            .col
                router-link(to="/settings").btn.btn-secondary &larr; Settings

</template>
