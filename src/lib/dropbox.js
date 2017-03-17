
import { readSettings } from '../lib/settings'
import Dropbox from 'dropbox'

let settings
try { settings = readSettings() }
catch ( e ) { settings = {} }

export const dropbox = new Dropbox({
    clientId: settings.accounts.dropbox.clientId
})

console.info(dropbox)

export const getAuthUrl = () => Dropbox.getAuthenticationUrl

export const testApi = () => {
    console.info('access tok', dropbox.accessToken)
}
