<script>

import Counter from './components/Counter'

export default {
    name: 'Root',
    components: {
        Counter
    }
}

</script>

<template lang="pug">

.root
    div
        router-link(to="/canvas") Canvas
        counter
        p Welcome to neodymium!
        p
            | To get a better understanding of how this works, check out
            a(href="http://soixantecircuits.github.io/nd", target="_blank") its documentation
            | . It is also recommended to go through the docs for
            a(href="http://webpack.github.io/", target="_blank") Webpack
            | and
            a(href="http://vuejs.github.io/vue-loader/", target="_blank") vue-loader
            | . If you have any issues with the setup, please file an issue at this boilerplate's
            a(href="https://github.com/soixantecircuits/nd", target="_blank") repository
            | .

</template>
