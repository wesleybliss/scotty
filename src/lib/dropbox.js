
import Dropbox from 'dropbox'

export const dropbox = new Dropbox({
    /*accessToken: 'R6NnNKS3jdUAAAAAAABmZgeI3GDNA-yDiebl8pRpwfzPdFYpnph1ZZ_iw77w3iNJ'*/
    clientId: 'sdvtf559660aqqr'
})

export const getAuthUrl = () => Dropbox.getAuthenticationUrl