<script>

import router from '../lib/router'
import { mapGetters } from 'vuex'
import { remote } from 'electron'
import CanvasCropper from '../lib/canvas-cropper'

export default {
    name: 'SelectArea',
    data: () => {
        return {
            canvasCropper: null,
            isCropped: false
        }
    },
    computed: {
        ...mapGetters({
            hasPendingFile: 'hasPendingFile',
            pendingFilePath: 'getPendingFilePath',
            windowNormalSize: 'getWindowNormalSize'
        }),
        pendingFileUri() {
            return 'file:///' + this.pendingFilePath + '?' + Date.now()
        }
    },
    methods: {
        
    },
    mounted() {
        
        if ( !this.hasPendingFile )
            router.replace( '/' )
        
        this.canvasCropper = new CanvasCropper(
            document.getElementById('canvas-background'),
            document.getElementById('canvas'),
            document.getElementById('canvas-cropped'),
            () => { this.isCropped = true },
            () => { router.push( '/post-process' ) }
        )
        
        /*let display = screen.getPrimaryDisplay()
        remote.getCurrentWindow().setSize( display.workArea.width, display.workArea.height )*/
        remote.getCurrentWindow().setFullScreen( true )
        
        this.canvasCropper.drawInitialCanvasImage( this.pendingFileUri )
        
    }
}

</script>

<template lang="pug">

#page-select-area
    
    #viewport
        canvas#canvas-background(v-show="!isCropped", width="100%", height="100%")
        canvas#canvas(v-show="!isCropped", :class="isCropped ? 'canvas-cropped' : ''", width="800", height="800")
        canvas#canvas-cropped(v-show="false", width="800", height="800")
    
    .container-fluid: .row: .col-12.pt-3
        
        .row: .col
            h4
                | Select Area
                //- small &nbsp; (MOUSE: {{ mouseIsDown ? 'DOWN' : 'UP' }})

</template>
