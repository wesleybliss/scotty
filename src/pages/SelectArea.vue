<script>

import os from 'os'
import path from 'path'
import fs from 'fs'
import router from '../lib/router'
import { mapGetters } from 'vuex'
import { remote, screen } from 'electron'
import { takeScreenshot } from '../lib/screenshot'

export default {
    name: 'SelectArea',
    data: () => {
        return {
            canvasBackground: null,
            canvas: null,
            canvasCropped: null,
            context: null,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
            mouseIsDown: false,
            cropArea: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
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
        setCanvasSizes( width, height ) {
            console.info( 'Resizing canvases to', width, height )
            Array( this.canvasBackground, this.canvas, this.canvasCropped )
                .forEach( canvas => {
                    canvas.width = width
                    canvas.height = height
                    canvas.style.width = width
                    canvas.style.height = height
                })
        },
        clearCanvas() {
            this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height )
        },
        drawInitialCanvasImage() {
            
            let backgroundCanvas = document.getElementById('canvas-background')
            let backgroundContext = backgroundCanvas.getContext('2d')
            let image = new Image()
            
            image.onload = () => {
                this.setCanvasSizes( image.width, image.height )
                backgroundContext.drawImage( image, 0, 0, image.width, image.height )
            }
            
            image.src = this.pendingFileUri
            
        },
        mouseDown( event ) {
            event.preventDefault()
            this.mouseIsDown = true
            let pos = this.getMousePos(event)
            this.clearCanvas()
            this.startX = this.endX = pos.x
            this.startY = this.endY = pos.y
        },
        mouseUp( event ) {
            event.preventDefault()
            if (!this.mouseIsDown) return
            this.mouseIsDown = false
            let pos = this.getMousePos(event)
            this.endX = pos.x
            this.endY = pos.y
            
            this.cropImage()
            
        },
        getMousePos( event ) {
            let rect = this.canvas.getBoundingClientRect()
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
        },
        trackMovement( event ) {
            
            event.preventDefault()
            
            if ( !this.mouseIsDown ) return
            
            let pos = this.getMousePos(event)
            this.endX = pos.x
            this.endY = pos.y
            
            let w = this.endX - this.startX
            let h = this.endY - this.startY
            let offsetX = ( w < 0 ) ? w : 0
            let offsetY = ( h < 0 ) ? h : 0
            let width = Math.abs( w )
            let height = Math.abs( h )
            
            this.cropArea.x = this.startX + offsetX
            this.cropArea.y = this.startY + offsetY
            this.cropArea.width = width
            this.cropArea.height = height
            
            this.clearCanvas()
            this.context.beginPath()
            this.context.rect( this.startX + offsetX, this.startY + offsetY, width, height )
            this.context.lineWidth = 0.5
            this.context.fillStyle = 'rgba(235, 235, 255, 0.5)'
            this.context.fill()
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
            this.context.stroke()
            
        },
        calculateAR( width, height ) {
            return width / height
        },
        resizeHeightAR( width, height, newWidth ) {
            let ar = this.calculateAR( width, height )
            let newHeight = newWidth / ar
            return newHeight
        },
        cropImage() {
            
            let tempImage = new Image()
            
            tempImage.onload = () => {
                
                this.clearCanvas()
                this.setCanvasSizes( this.cropArea.width, this.cropArea.height )
                
                this.context.drawImage(
                    tempImage,
                    this.cropArea.x,
                    this.cropArea.y,
                    this.cropArea.width,
                    this.cropArea.height,
                    0, 0,
                    this.cropArea.width,
                    this.cropArea.height
                )
                
                let nativeImageInstance = remote.nativeImage
                    .createFromDataURL( this.canvas.toDataURL( 'image/png', 1 ) )
                
                let screenshotPath = path.join( os.tmpdir(), 'shotty-screenshot.png' )
                
                fs.writeFile( screenshotPath, nativeImageInstance.toPNG(), err => {
                    
                    if ( err ) return window.alert(
                        'Error cropping screenshot\n' + JSON.stringify( err ) )
                    
                    console.info( 'Saved screenshot to', screenshotPath )
                    
                    /*remote.getCurrentWindow().hide()
                    remote.getCurrentWindow().setFullScreen( false )*/
                    setTimeout( () => { router.push( '/post-process' ) }, 300 )
                    
                })
                
            }
            
            tempImage.src = this.canvasBackground.toDataURL( 'image/png', 1 )
            
        }
    },
    mounted() {
        
        if ( !this.hasPendingFile )
            router.replace( '/' )
        
        this.canvasBackground = document.getElementById('canvas-background')
        this.canvas = document.getElementById('canvas')
        this.canvasCropped = document.getElementById('canvas-cropped')
        this.context = this.canvas.getContext('2d')
        
        this.canvas.onmousedown = this.mouseDown
        this.canvas.onmouseup = this.mouseUp
        this.canvas.onmousemove = this.trackMovement
        
        /*let display = screen.getPrimaryDisplay()
        remote.getCurrentWindow().setSize( display.workArea.width, display.workArea.height )*/
        remote.getCurrentWindow().setFullScreen( true )
        
        this.drawInitialCanvasImage()
        
    }
}

</script>

<template lang="pug">

#page-select-area
    
    #viewport
        canvas#canvas-background(width="100%", height="100%")
        canvas#canvas(width="100%", height="100%")
        canvas#canvas-cropped(v-show="isCropped", width="800", height="800")
    
    .container-fluid: .row: .col-12.pt-3
        
        .row: .col
            h4
                | Select Area
                //- small &nbsp; (MOUSE: {{ mouseIsDown ? 'DOWN' : 'UP' }})

</template>
