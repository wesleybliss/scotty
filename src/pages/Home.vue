<script>

import Counter from '../components/Counter'

export default {
    name: 'Root',
    data: () => {
        const TYPES = {
            WHOLE_SCREEN: 'whole-screen',
            CURRENT_WINDOW: 'current-window',
            SELECT_AREA: 'select-area'
        }
        return {
            TYPES,
            type: TYPES.WHOLE_SCREEN
        }
    },
    components: {
        Counter
    }
}

</script>

<template lang="pug">

.root
    
    .container-fluid: .row: .col-12.pt-3
        //- router-link(to="/select-area") Canvas
        .row: .col
            h4 Take Screenshot
        .row: .col
            label
                input(v-model="type", type="radio", name="type", value="whole-screen")
                | &nbsp;Grab the whole screen
            br
            label
                input(v-model="type", type="radio", name="type", value="current-window")
                | &nbsp;Grab the current window
            br
            label
                input(v-model="type", type="radio", name="type", value="select-area")
                | &nbsp;Select an area to grab
    
    footer.footer
        .container-fluid: .row
            .col
                button.btn.btn-secondary Cancel
            .col.text-right
                button.btn.btn-primary Take Screenshot

</template>
