<script>

import { mapGetters } from 'vuex'
import { readSettings, writeSettings } from '../lib/settings'

require('../styles/index.styl')

export default {
    name: 'App',
    data: () => {
        return {
            loadedSettings: {}
        }
    },
    computed: {
        ...mapGetters({
            settings: 'getSettings'
        })
    },
    mounted() {
        
        try {
            this.loadedSettings = readSettings()
        }
        catch ( e ) {
            this.loadedSettings = e
        }
        
    }
}

</script>

<template lang="pug">

#app
    .container-fluid(v-if="false"): .row: .col
        pre: code SET: {{ JSON.stringify( loadedSettings, null, '    ' ) }}
    router-view

</template>
