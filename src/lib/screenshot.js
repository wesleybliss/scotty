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


export const getSources = () => new Promise( ( resolve, reject ) => {
    desktopCapturer.getSources( { types:['window', 'screen'] }, ( error, sources ) => {
        if ( error ) return reject( error )
        resolve( sources )
    })
})


export const takeScreenshot = sourceName => {
    
    let options = {
        types: [ 'screen' ],
        thumbnailSize: determineScreenShotSize()
    }
    
    // If no target source name is given, use the screen
    let filter = [ 'Entire screen', 'Screen 1' ]
    
    // If a target source name is given, expand the sources search
    // to include windows, and limit the filter to the source name
    if ( sourceName ) {
        options.types.push( 'window' )
        filter = [ sourceName ]
    }
    
    return new Promise( ( resolve, reject ) => {
        
        desktopCapturer.getSources( options, ( error, sources ) => {
            
            if ( error ) return reject( error )
            
            sources.forEach( source => {
                
                if ( filter.includes( source.name ) ) {
                    
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
