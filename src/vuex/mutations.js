
import {
    SET_PENDING_FILE_PATH
} from './mutation-types'


export default {
    
    [SET_PENDING_FILE_PATH]( state, pendingFilePath ) {
        state.pendingFilePath = pendingFilePath
    }
    
}
