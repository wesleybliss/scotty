
import {
    SET_SETTINGS,
    SET_DROPBOX_ACCESS_TOKEN,
    SET_DROPBOX_AUTH,
    SET_PENDING_FILE_PATH
} from './mutation-types'


export default {
    
    [SET_SETTINGS]( state, settings ) {
        state.settings = settings
    },
    
    [SET_DROPBOX_ACCESS_TOKEN]( state, accessToken ) {
        state.settings.accounts.dropbox.accessToken = accessToken
    },
    
    [SET_DROPBOX_AUTH]( state, auth ) {
        state.settings.accounts.dropbox.auth = auth
    },
    
    [SET_PENDING_FILE_PATH]( state, pendingFilePath ) {
        state.pendingFilePath = pendingFilePath
    }
    
}
