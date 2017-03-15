'use strict'

const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const shell = electron.shell
const ipcMain = electron.ipcMain


const app = electron.app

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

const onClosed = () => {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null
}

const createMainWindow = () => {
    
    /*const screen = electron.screen
    const display = screen.getPrimaryDisplay()*/
    
    const win = new electron.BrowserWindow({
        width: 400,
        height: 300
    })
    
	win.loadURL( `file://${__dirname}/index.html` )
    
    win.webContents.openDevTools()
    
	win.on( 'closed', onClosed )
    
	return win
    
}

app.on( 'window-all-closed', () => {
	if ( process.platform !== 'darwin' ) {
		app.quit()
	}
})

app.on( 'activate', () => {
	if ( !mainWindow ) {
		mainWindow = createMainWindow()
	}
})

app.on( 'ready', () => {
	mainWindow = createMainWindow()
})

ipcMain.on( 'browse-folder', ( event, arg ) => {
    console.log( 'sending res-browse-folder' )
    event.sender.send( 'res-browse-folder', 'foo' )
})

const isRenderer() {
    // running in a web browser
    if (typeof process === 'undefined') return true
    // node-integration is disabled
    if (!process) return true
    // We're in node.js somehow
    if (!process.type) return false
    return process.type === 'renderer'
}

console.info( 'isRenderer? ' + (isRenderer() ? 'yes' : 'no') )