// Do not use `webpack-merge` since there is no devDependencies in packaged app
var prodEnv = require('./prod.env')

module.exports = Object.assign({}, prodEnv, {
  NODE_ENV: '"development"',
  FOO: JSON.stringify( process.env.SCOTTY_DB_CLIENT_KEY || '' )
})
