'use strict'

const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const shell = electron.shell



const app = electron.app

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null
}

function createMainWindow() {
    
    const screen = electron.screen
    const display = screen.getPrimaryDisplay()
    console.log('FULLSCREEN', display.workArea)
    
	/*const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	})*/
    
    const win = new electron.BrowserWindow({
        width: display.workArea.width,
        height: display.workArea.height
    })

	win.loadURL(`file://${__dirname}/index.html`)
    
    win.webContents.openDevTools()
    
	win.on('closed', onClosed)

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
})

app.on('ready', () => {
	mainWindow = createMainWindow()
})
