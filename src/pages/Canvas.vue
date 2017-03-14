<script>

import { takeScreenshot } from '../lib/screenshot'

export default {
    name: 'Canvas',
    data: () => {
        return {
            canvas: null,
            context: null,
            startX: null,
            endX: null,
            startY: null,
            endY: null,
            mouseIsDown: false
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
        }
    },
    mounted() {
        
        this.canvas = document.getElementById('canvas')
        this.context = this.canvas.getContext('2d')
        
        this.canvas.onmousedown = this.mouseDown
        this.canvas.onmouseup = this.mouseUp
        this.canvas.onmousemove = this.trackMovement
        
        let backgroundCanvas = document.getElementById('canvas-background')
        let backgroundContext = backgroundCanvas.getContext('2d')
        
        takeScreenshot()
            .then( screenshotPath => {
                
                let image = new Image()
                
                image.onload = () => {
                    let w = this.canvas.width
                    let h = this.resizeHeightAR( image.width, image.height, w )
                    // image, dx, dy, dWidth, dHeight
                    backgroundContext.drawImage( image, 0, 0, w, h )
                }
                
                image.src = 'file:///' + screenshotPath
                
            })
            .catch( err => console.error )
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
