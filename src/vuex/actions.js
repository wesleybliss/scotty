
import {
    SET_SETTINGS,
    SET_DROPBOX_CLIENT_ID,
    SET_DROPBOX_AUTH,
    SET_PENDING_FILE_PATH
} from './mutation-types'


export const setSettings = ( { commit }, settings ) =>
    commit( SET_SETTINGS, settings )

export const setDropboxClientId = ( { commit }, clientId ) =>
    commit( SET_DROPBOX_CLIENT_ID, clientId )

export const setDropboxAuth = ( { commit }, auth ) =>
    commit( SET_DROPBOX_AUTH, auth )

export const setPendingFilePath = ( { commit }, pendingFilePath ) =>
    commit( SET_PENDING_FILE_PATH, pendingFilePath )
