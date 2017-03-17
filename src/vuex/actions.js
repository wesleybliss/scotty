
import {
    SET_DROPBOX_AUTH,
    SET_PENDING_FILE_PATH
} from './mutation-types'


export const setDropboxAuth = ( { commit }, auth ) =>
    commit( SET_DROPBOX_AUTH, auth )

export const setPendingFilePath = ( { commit }, pendingFilePath ) =>
    commit( SET_PENDING_FILE_PATH, pendingFilePath )
