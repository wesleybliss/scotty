
import { readSettings } from '../lib/settings'
import Dropbox from 'dropbox'

let settings

try {
    settings = readSettings()
    console.log( 'dropbox', settings )
}
catch ( e ) {
    settings = {}
}

const opts = {}

try {
    opts.accessToken = settings.accounts.dropbox.accessToken
}
catch ( e ) {
    
}

export const dropbox = new Dropbox( opts )

console.info(dropbox)

export const getAuthUrl = () => Dropbox.getAuthenticationUrl

export const testApi = () => {
    console.info('access tok', dropbox.accessToken)
}
