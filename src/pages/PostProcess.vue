<script>

import router from '../lib/router'
import { mapGetters, mapActions } from 'vuex'
import { remote, ipcRenderer } from 'electron'
import fs from 'fs'
import path from 'path'
import { takeScreenshot } from '../lib/screenshot'
import moment from 'moment'

export default {
    name: 'PostProcess',
    data: () => {
        return {
            homePath: remote.app.getPath('home'),
            homeFolders: [],
            picturesPath: remote.app.getPath('pictures'),
            saveFileName: 'Screenshot from ' + moment().format( 'YYYY-MM-DD h-mm-ssa' ) + '.png',
            saveFilePath: remote.app.getPath('pictures')
        }
    },
    computed: {
        ...mapGetters({
            hasPendingFile: 'hasPendingFile',
            pendingFilePath: 'getPendingFilePath'
        }),
        homeFoldersDivider() {
            return this.homeFolders.length < 1
                ? '' : '─'.repeat( this.homeFolders.reduce(
                    ( a, b ) => a.length > b.length ? a : b ) )
        }
    },
    methods: {
        isRenderer() {
            // running in a web browser
            if (typeof process === 'undefined') return true
            // node-integration is disabled
            if (!process) return true
            // We're in node.js somehow
            if (!process.type) return false
            return process.type === 'renderer'
        },
        selectDirectory() {
            //document.querySelector('input[type="file"]').click()
            remote.dialog.showOpenDialog( remote.getCurrentWindow(), {
                properties: [ 'openDirectory' ]
            })
        },
        updateSaveFilePath() {
            //this.saveFilePath = ''
            console.log( arguments )
        }
    },
    mounted() {
        
        if ( !this.hasPendingFile )
            router.replace( '/' )
        
        console.info( this.saveFilePath )
        
        fs.readdir( this.homePath, ( err, items ) => {
            this.homeFolders = items
                .filter( item => !item.startsWith( '.' ) )
                .map( item => path.join( this.homePath, item ) )
                .filter( item => fs.statSync( item ).isDirectory() )
                .map( item => {
                    return {
                        name: item.split( '/' ).pop(),
                        path: item
                    }
                })
        })
        
    }
}

</script>

<template lang="pug">

.root
    
    .container-fluid: .row: .col-12.pt-3
        .row: .col
            h4 Save Screenshot {{ homeFoldersDivider }}
        .row
            .col-4
                img(:src="'file:///' + pendingFilePath", width="100%")
            .col-8.no-padding-left
                .form-group
                    input.form-control(type="text", v-model="saveFileName")
                    select(v-model="saveFilePath").custom-select.mt-1
                        option(v-for="dir in homeFolders", :value="dir.path") {{ dir.name }}
                    button.btn.btn-default.mt-1.ml-1(@click="selectDirectory") ...
    
    footer.footer
        .container-fluid: .row
            .col
                button.btn.btn-secondary Copy to Clipboard
            .col.text-right
                button.btn.btn-primary Save

</template>
