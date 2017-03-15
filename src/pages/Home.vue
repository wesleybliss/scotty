<script>

import Counter from '../components/Counter'

export default {
    name: 'Root',
    data: () => {
        return {
            TYPES: {
                WHOLE_SCREEN: 'whole-screen',
                CURRENT_WINDOW: 'current-window',
                SELECT_AREA: 'select-area'
            },
            type: 0
        }
    },
    components: {
        Counter
    }
}

</script>

<template lang="pug">

.root
    
    //- router-link(to="/select-area") Canvas
    
    h4 Screenshot
    
    div
        label
            input(v-model="type", type="radio", name="type", value="whole-screen")
            | Grab the whole screen
        br
        label
            input(v-model="type", type="radio", name="type", value="current-window")
            | Grab the current window
        br
        label
            input(v-model="type", type="radio", name="type", value="select-area")
            | Select an area to grab
    

</template>
