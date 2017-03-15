<script>

import { remote, screen } from 'electron'
import { takeScreenshot } from '../lib/screenshot'

export default {
    name: 'SelectArea',
    data: () => {
        return {
            canvasBackground: null,
            canvas: null,
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
            }
        }
    },
    methods: {
        clearCanvas() {
            this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height )
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
                this.context.drawImage(
                    // imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight
                    tempImage,
                    this.cropArea.x,
                    this.cropArea.y,
                    this.cropArea.width,
                    this.cropArea.height,
                    0, 0,
                    this.cropArea.width,
                    this.cropArea.height
                )
            }
            
            tempImage.src = this.canvasBackground.toDataURL( 'image/png', 1 )
            
        }
    },
    mounted() {
        
        this.canvasBackground = document.getElementById('canvas-background')
        this.canvas = document.getElementById('canvas')
        this.context = this.canvas.getContext('2d')
        
        this.canvas.onmousedown = this.mouseDown
        this.canvas.onmouseup = this.mouseUp
        this.canvas.onmousemove = this.trackMovement
        
        let backgroundCanvas = document.getElementById('canvas-background')
        let backgroundContext = backgroundCanvas.getContext('2d')
        
        let display = screen.getPrimaryDisplay()
        remote.getCurrentWindow().hide()
        remote.getCurrentWindow().setSize( display.workArea.width, display.workArea.height )
        
        setTimeout( () => {
            
            takeScreenshot()
                .then( screenshotPath => {
                    
                    let image = new Image()
                    
                    image.onload = () => {
                        
                        let w = this.canvas.width
                        let h = this.resizeHeightAR( image.width, image.height, w )
                        
                        // image, dx, dy, dWidth, dHeight
                        backgroundContext.drawImage( image, 0, 0, w, h )
                        
                        remote.getCurrentWindow().show()
                        
                    }
                    
                    image.src = 'file:///' + screenshotPath
                    
                })
                .catch( err => console.error )
            
        }, 500 )
        
    }
}

</script>

<template lang="pug">

div#section-canvas
    
    #viewport
        canvas#canvas-background(width="800", height="800")
        canvas#canvas(width="800", height="800")
    
    h1 Hello
    div Mouse is: {{ mouseIsDown ? 'down' : 'up' }}

</template>
