<script>

import router from '../lib/router'
import { mapGetters, mapActions } from 'vuex'
import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { dropbox } from '../lib/dropbox'
import { clipboard } from 'electron'

export default {
    name: 'PostProcess',
    data: () => {
        return {
            
            homePath: remote.app.getPath('home'),
            homeFolders: [],
            picturesPath: remote.app.getPath('pictures'),
            saveFileName: 'Screenshot from ' + moment().format( 'YYYY-MM-DD h-mm-ssa' ) + '.png',
            saveFilePath: remote.app.getPath('pictures'),
            
            nativeImageInstance: null,
            
            btnCopyToClipboardEnabled: true,
            btnCopyToClipboardLabel: 'Copy to Clipboard',
            btnCopyToClipboardTimer: -1,
            
            btnSaveEnabled: true,
            btnSaveLabel: 'Save',
            btnSaveTimer: -1,
            
            uploadOptionDropbox: true
            
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings',
            hasPendingFile: 'hasPendingFile',
            pendingFilePath: 'getPendingFilePath'
        }),
        pendingFileUri() {
            // Date to cache-bust image
            return 'file:///' + this.pendingFilePath + '?' + Date.now()
        },
        fullSavePath() {
            return path.join( this.saveFilePath, this.saveFileName )
        }
    },
    methods: {
        quitApp() {
            remote.app.quit()
        },
        onImageLoaded() {
            let img = document.querySelector('img#preview')
            remote.getCurrentWindow().setSize( 400, img.height + 380 )
        },
        selectDirectory() {
            remote.dialog.showOpenDialog(
                remote.getCurrentWindow(),
                {
                    title: 'Choose a directory',
                    defaultPath: this.saveFilePath,
                    properties: [ 'openDirectory' ]
                },
                filePaths => {
                    
                    if ( filePaths && filePaths.length > 0 ) {
                        
                        let newPath = filePaths.pop()
                        
                        fs.stat( newPath, ( err, stats ) => {
                            
                            if ( err ) return
                            
                            let hasPath = false
                            
                            this.homeFolders.forEach( dir => {
                                if ( dir.path === newPath )
                                    hasPath = true
                            })
                            
                            if ( !hasPath )
                                this.homeFolders.push({
                                    name: newPath.split('/').pop(),
                                    path: newPath
                                })
                            
                            this.saveFilePath = newPath
                        
                        })
                        
                    }
                    
                }
            )
        },
        copyToClipboard() {
            
            this.btnCopyToClipboardEnabled = false
            
            remote.clipboard.writeImage( this.nativeImageInstance )
            
            this.btnCopyToClipboardLabel = 'Copied to Clipboard!'
            clearTimeout( this.btnCopyToClipboardTimer )
            this.btnCopyToClipboardTimer = setTimeout( () => {
                this.btnCopyToClipboardLabel = 'Copy to Clipboard'
                this.btnCopyToClipboardEnabled = true
            }, 2000 )
            
        },
        saveToPath() {
            
            this.btnSaveEnabled = false
            this.btnSaveLabel = 'Saving...'
            
            setTimeout( () => {
                fs.stat( this.saveFilePath, ( err, stats ) => {
                    if ( err ) return window.alert( 'Invalid path ' + this.saveFilePath )
                    console.log( 'Saving to', this.fullSavePath )
                    fs.writeFile(
                        this.fullSavePath,
                        this.nativeImageInstance.toPNG(),
                        err => {
                            
                            if ( err ) window.alert( 'Error saving image\n' + JSON.stringify( err ) )
                            
                            if ( !this.uploadOptionDropbox ) {
                                this.btnSaveEnabled = true
                                this.btnSaveLabel = 'Save'
                                return
                            }
                            
                            this.uploadToDropbox()
                                .then( meta => {
                                    return Promise.all([
                                        Promise.resolve( meta ),
                                        this.getDropboxSharedLink( meta )
                                    ])
                                })
                                .then( ([ meta, shareLink ]) => {
                                    console.info( meta, shareLink )
                                    remote.clipboard.writeText( shareLink.url )
                                    new Notification( 'Scotty', {
                                        body: 'Dropbox screenshot copied to clipboard'
                                    })
                                    this.btnSaveEnabled = true
                                    this.btnSaveLabel = 'Save'
                                })
                                .catch( err => {
                                    console.error( err )
                                    this.btnSaveEnabled = true
                                    this.btnSaveLabel = 'Save'
                                })
                            
                        }
                    )
                })
            }, 100 )
            
        },
        uploadToDropbox() {
            return dropbox.filesUpload({
                contents: this.nativeImageInstance.toPNG(),
                path: '/' + this.saveFileName,
                mode: {
                    '.tag': 'add'
                },
                autorename: true
            })
        },
        getDropboxSharedLink( meta ) {
            // `meta` = dropbox upload response
            return dropbox.sharingCreateSharedLink({
                path: meta.path_lower,
                short_url: true
            })
        }
    },
    mounted() {
        
        if ( !this.hasPendingFile )
            router.replace( '/' )
        
        remote.getCurrentWindow().setFullScreen( false )
        remote.getCurrentWindow().show()
        
        console.info( this.saveFilePath, remote )
        
        this.nativeImageInstance = remote.nativeImage.createFromPath( this.pendingFilePath )
        
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
        
        dropbox.accessToken = this.settings.accounts.dropbox.auth.access_token
        
    }
}

</script>

<template lang="pug">

#page-post-process
    
    .container-fluid: .row: .col-12.pt-3
        
        .row: .col
            h4
                | Save Screenshot
                button.close(
                    type="button",
                    aria-label="Close",
                    @click="quitApp")
                    span(aria-hidden="true") &times;
        
        .row
            .col
                img#preview(:src="pendingFileUri", @load="onImageLoaded")
        
        .row.mt-3
            .col
                #save-options.form-group
                    input.form-control(type="text", v-model="saveFileName")
                    .d-flex.flex-nowrap
                        select(v-model="saveFilePath").custom-select.mt-1
                            option(v-for="dir in homeFolders", :value="dir.path") {{ dir.name }}
                        button.btn.btn-default.mt-1.ml-1(@click="selectDirectory") ...
        
        // @todo Maybe make these tabs
        .row.mt-3
            .col-5
                hr
            .col-2
                .text-center or
            .col-5
                hr
        
        .row.mt-3
            .col
                h4 Upload Screenshot To
                .form-group
                    label.custom-control.custom-checkbox
                        input.custom-control-input(type="checkbox", v-model="uploadOptionDropbox")
                        span.custom-control-indicator
                        span.custom-control-description &nbsp; Dropbox
    
    footer.footer
        .container-fluid: .row
            .col
                button.btn(
                    @click="copyToClipboard",
                    v-bind:class="btnCopyToClipboardEnabled ? 'btn-secondary' : 'btn-success'")
                    | {{ btnCopyToClipboardLabel }}
            .col.text-right
                button.btn(
                    @click="saveToPath",
                    :disabled="!btnSaveEnabled",
                    v-bind:class="btnSaveEnabled ? 'btn-primary' : 'btn-disabled'")
                    | {{ btnSaveLabel }}

</template>
