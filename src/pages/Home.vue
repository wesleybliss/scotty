<script>

import router from '../lib/router'
import { mapGetters, mapActions } from 'vuex'
import { remote } from 'electron'
import { getSources, takeScreenshot } from '../lib/screenshot'

export default {
    name: 'Home',
    data: () => {
        const TYPES = {
            WHOLE_SCREEN: 'whole-screen',
            CURRENT_WINDOW: 'current-window',
            SPECIFIC_WINDOW: 'specific-window',
            SELECT_AREA: 'select-area'
        }
        return {
            TYPES,
            type: TYPES.WHOLE_SCREEN,
            sources: [],
            specificWindow: '',
            dropdownSourcesClass: ''
        }
    },
    computed: {
        ...mapGetters({
            pendingFilePath: 'getPendingFilePath'
        })
    },
    methods: {
        ...mapActions([
            'setPendingFilePath'
        ]),
        quitApp() {
            remote.app.quit()
        },
        simplifyWindowName( name ) {
            if ( name.length < 60 ) return name
            let quarterLen = Math.min( 22, ( name.length / 4 ) )
            return name.substring( 0, quarterLen ) +
                ' ... ' + name.substring( name.length - quarterLen )
        },
        selectSource( name ) {
            if ( this.type !== this.TYPES.SPECIFIC_WINDOW )
                this.type = this.TYPES.SPECIFIC_WINDOW
            this.specificWindow = name
            console.log( 'source', name )
        },
        _captureScreenshot( optionalWindowName, redirectUri ) {
            takeScreenshot( optionalWindowName || false )
                .then( screenshotPath => {
                    this.setPendingFilePath( screenshotPath )
                    router.push( redirectUri || '/post-process' )
                    remote.getCurrentWindow().show()
                })
                .catch( err => {
                    console.error( err )
                    remote.getCurrentWindow().show()
                })
        },
        captureScreenshot() {
            
            switch ( this.type ) {
                
                case this.TYPES.SPECIFIC_WINDOW:
                    return this._captureScreenshot( this.specificWindow )
                
                case this.TYPES.SELECT_AREA:
                    remote.getCurrentWindow().hide()
                    return setTimeout( this._captureScreenshot( false, '/select-area' ), 500 )
                
                case this.TYPES.WHOLE_SCREEN:
                default:
                    remote.getCurrentWindow().hide()
                    return setTimeout( this.captureFullscreen, 500 )
                
            }
            
        }
    },
    mounted() {
        
        remote.getCurrentWindow().setFullScreen( false )
        
        // @todo Also make a list of common excludes, like "nautilus-desktop"
        let sourcesExclude = [ 'Entire screen', 'Screen 1' ]
        
        getSources()
            .then( sources => sources.filter( s => !sourcesExclude.includes( s.name ) ) )
            .then( sources => { this.sources = sources } )
            .then( () => { this.specificWindow = this.sources[0].name })
            .catch( err => {
                console.error( err )
                this.sources = [ 'Error finding sources' ]
            })
        
    }
}

</script>

<template lang="pug">

#page-home
    
    .container-fluid: .row: .col-12.pt-3
        
        .row: .col
            h4 Take Screenshot
        
        .row: .col
            label
                input(v-model="type", type="radio", name="type", value="whole-screen")
                span &nbsp;Grab the whole screen
            br
            label
                input(v-model="type", type="radio", name="type", value="current-window", disabled="disabled")
                span &nbsp;Grab the current window
            br
            label
                input(v-model="type", type="radio", name="type", value="select-area")
                span &nbsp;Select an area to grab
            br
            label
                input(v-model="type", type="radio", name="type", value="specific-window")
                span &nbsp;Grab
                i(v-if="specificWindow") &nbsp;{{ specificWindow }}
                .list-group.mt-2(v-if="type === TYPES.SPECIFIC_WINDOW")
                    a.list-group-item.list-group-item-action(
                        v-for="source in sources",
                        @click.prevent.default="selectSource( source.name )",
                        :class="specificWindow === source.name ? 'active' : ''")
                        img(:src="source.thumbnail.toDataURL()", width="75")
                        span {{ simplifyWindowName( source.name ) }}
    
    footer.footer
        .container-fluid: .row
            .col
                button.btn.btn-secondary(@click="quitApp") Cancel
            .col.text-right
                button.btn.btn-primary(@click="captureScreenshot") Take Screenshot

</template>
