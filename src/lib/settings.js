
import os from 'os'
import path from 'path'
import fs from 'fs'


const getUserDataPath = () =>
    process.env.APPDATA || path.resolve(
        process.platform === 'darwin'
            ? path.resolve( os.homedir(), 'Library/Preferences' )
            : path.resolve( os.homedir(), '.config' )
    )

const getSettingsPath = () =>
    path.join( getUserDataPath(), 'scotty.settings.json' )

export const readSettings = () =>
    JSON.parse( fs.readFileSync( getSettingsPath(), 'utf8' ) )

export const writeSettings = settings =>
    fs.writeFileSync( getSettingsPath(), JSON.stringify( settings ), 'utf8' )
