
import {
    SET_DROPBOX_AUTH,
    SET_PENDING_FILE_PATH
} from './mutation-types'


export default {
    
    [SET_DROPBOX_AUTH]( state, auth ) {
        state.settings.accounts.dropbox.auth = auth
    },
    
    [SET_PENDING_FILE_PATH]( state, pendingFilePath ) {
        state.pendingFilePath = pendingFilePath
    }
    
}
