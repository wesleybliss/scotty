
import {
    SET_SETTINGS,
    SET_DROPBOX_ACCESS_TOKEN,
    SET_DROPBOX_AUTH,
    SET_PENDING_FILE_PATH
} from './mutation-types'


export const setSettings = ( { commit }, settings ) =>
    commit( SET_SETTINGS, settings )

export const setDropboxAccessToken = ( { commit }, accessToken ) =>
    commit( SET_DROPBOX_ACCESS_TOKEN, accessToken )

export const setDropboxAuth = ( { commit }, auth ) =>
    commit( SET_DROPBOX_AUTH, auth )

export const setPendingFilePath = ( { commit }, pendingFilePath ) =>
    commit( SET_PENDING_FILE_PATH, pendingFilePath )
