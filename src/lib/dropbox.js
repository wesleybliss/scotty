
import Dropbox from 'dropbox'

export const dropbox = new Dropbox({
    /*accessToken: 'R6NnNKS3jdUAAAAAAABmZgeI3GDNA-yDiebl8pRpwfzPdFYpnph1ZZ_iw77w3iNJ'*/
    clientId: process.env.SCOTTY_DB_CLIENT_KEY
})

console.info(dropbox)

export const getAuthUrl = () => Dropbox.getAuthenticationUrl

export const testApi = () => {
    console.info('access tok', dropbox.accessToken)
}
