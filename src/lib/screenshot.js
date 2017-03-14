'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell


export const determineScreenShotSize = () => {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max( screenSize.width, screenSize.height )
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}


export const takeScreenshot = () => {
    
    let options = {
        types: ['screen'],
        thumbnailSize: determineScreenShotSize()
    }
    
    return new Promise( ( resolve, reject ) => {
        
        desktopCapturer.getSources( options, ( error, sources ) => {
            
            if ( error ) return reject( error )
            
            sources.forEach( source => {
                
                if ( source.name === 'Entire screen' || source.name === 'Screen 1' ) {
                    
                    let screenshotPath = path.join( os.tmpdir(), 'shotty-screenshot.png' )
                    
                    fs.writeFile( screenshotPath, source.thumbnail.toPng(), error => {
                        if ( error ) return reject( error )
                        //shell.openExternal( 'file://' + screenshotPath )
                        resolve( screenshotPath )
                        
                    })
                    
                }
                
            })
            
        })
        
    })
    
}
