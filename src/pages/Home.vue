<script>

import router from '../lib/router'
import { mapGetters, mapActions } from 'vuex'
import { remote } from 'electron'
import { takeScreenshot } from '../lib/screenshot'

export default {
    name: 'Home',
    data: () => {
        const TYPES = {
            WHOLE_SCREEN: 'whole-screen',
            CURRENT_WINDOW: 'current-window',
            SELECT_AREA: 'select-area'
        }
        return {
            TYPES,
            type: TYPES.WHOLE_SCREEN
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
        captureScreenshot() {
            
            remote.getCurrentWindow().hide()
            
            setTimeout( () => {
                takeScreenshot()
                    .then( screenshotPath => {
                        this.setPendingFilePath( screenshotPath )
                        router.push( '/post-process' )
                        remote.getCurrentWindow().show()
                    })
                    .catch( err => console.error )
            }, 500 )
            
        }
    },
    mounted() {
        
    }
}

</script>

<template lang="pug">

.root
    
    .container-fluid: .row: .col-12.pt-3
        //- router-link(to="/select-area") Canvas
        .row: .col
            h4 Take Screenshot {{ pendingFilePath }}
        .row: .col
            label
                input(v-model="type", type="radio", name="type", value="whole-screen")
                | &nbsp;Grab the whole screen
            br
            label
                input(v-model="type", type="radio", name="type", value="current-window")
                | &nbsp;Grab the current window
            br
            label
                input(v-model="type", type="radio", name="type", value="select-area")
                | &nbsp;Select an area to grab
    
    footer.footer
        .container-fluid: .row
            .col
                button.btn.btn-secondary Cancel
            .col.text-right
                button.btn.btn-primary(@click="captureScreenshot") Take Screenshot

</template>
