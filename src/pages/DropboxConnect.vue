<script>

export default {
    name: 'DropboxConnect',
    data: () => {
        dropboxResponse: null
    },
    mounted() {
        
        // After the user has authorized your app, they’ll be sent
        // to your redirect URI, with a few query parameters:
        // https://www.example.com/mycallback?code=<authorization code>&state=<CSRF token>
        
        this.dropboxResponse = {}
        
        window.location.hash.substring(1).split('&').forEach( x => {
            let [ key, val ] = x.split('=')
            this.dropboxResponse[key] = val
        })
        
        console.log( 'Dropbox response', this.$route.query )
        
    }
}

</script>

<template lang="pug">

#page-dropbox-connect
    
    .container-fluid: .row: .col-12.pt-3
        
        .row
            .col
                h4 Dropbox Connect
        
        .row(v-if="dropboxResponse")
            .col
                pre: code {{ JSON.stringify( $route.query, null, '    ' ) }}

</template>
