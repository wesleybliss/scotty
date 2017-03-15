
import {
    SET_PENDING_FILE_PATH
} from './mutation-types'


export const setPendingFilePath = ( { commit }, pendingFilePath ) =>
    commit( SET_PENDING_FILE_PATH, pendingFilePath )
