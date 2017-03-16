
export const getWindowNormalSize = state => state.window.normalSize

export const getPendingFilePath = state => state.pendingFilePath

export const hasPendingFile = state =>
    state.pendingFilePath && state.pendingFilePath.trim().length > 0