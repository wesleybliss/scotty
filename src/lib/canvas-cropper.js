'use strict'

import os from 'os'
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'


export default class CanvasCropper {
    
    /**
     * Canvas helper for cropping sections of an image
     * 
     * @param  {Element} canvasBackground     Background canvas for loading
     * @param  {Element} canvas               Canvas for cropping
     * @param  {Element} canvasCropped        Canvas crop pending holder
     * @param  {Function} [onBeforeCropImage] Callback before crop starts
     * @param  {Function} [onAfterCropImage]  Callback after crop ends
     */
    constructor( canvasBackground, canvas, canvasCropped, onBeforeCropImage, onAfterCropImage ) {
        
        this.canvasBackground = canvasBackground
        this.canvas = canvas
        this.canvasCropped = canvasCropped
        this.context = this.canvas.getContext('2d')
        this.startX = null
        this.endX = null
        this.startY = null
        this.endY = null
        this.mouseIsDown = false
        this.cropArea = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
        this.onBeforeCropImage = onBeforeCropImage
        this.onAfterCropImage = onAfterCropImage
        
        // Bind DOM event handlers
        this.canvas.onmousedown = this.mouseDown.bind( this )
        this.canvas.onmouseup = this.mouseUp.bind( this )
        this.canvas.onmousemove = this.trackMovement.bind( this )
        
    }
    
    /**
     * Sets the size of all canvases
     * 
     * @param {Number} width  New canvas width
     * @param {Number} height New canvas height
     */
    setCanvasSizes( width, height ) {
        console.info( 'Resizing canvases to', width, height )
        Array( this.canvasBackground, this.canvas, this.canvasCropped )
            .forEach( canvas => {
                canvas.width = width
                canvas.height = height
                canvas.style.width = width
                canvas.style.height = height
            })
    }
    
    /**
     * Clears the main working canvas
     */
    clearCanvas() {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height )
    }
    
    /**
     * Draws the initial temp image on the main working canvas
     * 
     * @param  {String} imageUri Image URI
     */
    drawInitialCanvasImage( imageUri ) {
        
        console.info( 'Drawing initial canvas image', imageUri )
        
        let backgroundContext = this.canvasBackground.getContext('2d')
        let image = new Image()
        
        image.onload = () => {
            this.setCanvasSizes( image.width, image.height )
            backgroundContext.drawImage( image, 0, 0, image.width, image.height )
        }
        
        image.src = imageUri
        
    }
    
    /**
     * Calculates aspect ratio
     * 
     * @param  {Number} width  Initial width
     * @param  {Number} height Initial height
     * @return {Number}        Aspect ratio
     */
    calculateAR( width, height ) {
        return width / height
    }
    
    /**
     * Resizes the height dimension + keeps aspect ratio
     * 
     * @param  {Number} width    Initial width
     * @param  {Number} height   Initial height
     * @param  {Number} newWidth New desired width
     * @return {Number}          New calculated height
     */
    resizeHeightAR( width, height, newWidth ) {
        let ar = this.calculateAR( width, height )
        let newHeight = newWidth / ar
        return newHeight
    }
    
    /**
     * Gets the current mouse cursor position
     * 
     * @param  {Object} event DOM event for mouse
     * @return {Object}       X & Y coordinates for the mouse
     */
    getMousePos( event ) {
        let rect = this.canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }
    
    /**
     * Handler for mousedown events that records
     * the mouse position for our starting coordinates
     * 
     * @param  {Object} event DOM event for mouse
     */
    mouseDown( event ) {
        
        event.preventDefault()
        
        this.mouseIsDown = true
        
        let pos = this.getMousePos(event)
        this.clearCanvas()
        this.startX = this.endX = pos.x
        this.startY = this.endY = pos.y
    }
    
    /**
     * Handler for mouseup events that records
     * the mouse position for our ending coordinates,
     * and then begins the crop operation
     * 
     * @param  {Object} event DOM event for mouse
     */
    mouseUp( event ) {
        
        event.preventDefault()
        
        if (!this.mouseIsDown) return
        
        this.mouseIsDown = false
        
        let pos = this.getMousePos(event)
        this.endX = pos.x
        this.endY = pos.y
        
        this.cropImage()
        
    }
    
    /**
     * Tracks mouse movement, updating the target crop
     * area coordinates, while drawing a visual rect for cropping
     * 
     * @param  {Object} event DOM event for mouse
     */
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
        
    }
    
    /**
     * Crops the current selection on the main
     * canvas, and saves it to a temp file
     * 
     * This will also trigger #onBeforeCropImage and #onAfterCropImage
     */
    cropImage() {
        
        if ( this.onBeforeCropImage instanceof Function )
            this.onBeforeCropImage()
        
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
            
            let screenshotPath = path.join( os.tmpdir(), 'scotty-screenshot.png' )
            
            fs.writeFile( screenshotPath, nativeImageInstance.toPNG(), err => {
                
                if ( err ) return window.alert(
                    'Error cropping screenshot\n' + JSON.stringify( err ) )
                
                console.info( 'Saved screenshot to', screenshotPath )
                
                if ( this.onAfterCropImage instanceof Function )
                    this.onAfterCropImage()
                
            })
            
        }
        
        tempImage.src = this.canvasBackground.toDataURL( 'image/png', 1 )
        
    }
    
}
