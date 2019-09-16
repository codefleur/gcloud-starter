const PORT = process.env.PORT || 80
const URL_PING = process.env.URL_PING || "http://gccxpi.duckdns.org/api/config"
const URL_REDIRECT = process.env.URL_REDIRECT || "http://gccxpi.duckdns.org/"
const COMPUTE_ZONE = process.env.COMPUTE_ZONE
const COMPUTE_INSTANCE = process.env.COMPUTE_INSTANCE
const SPINNER = process.env.SPINNER || "purple"

const compute = new (require('@google-cloud/compute'))()
const fetch = require("node-fetch")

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

console.clear()

async function startInstance() {
  console.log( `> Will start instance: ${COMPUTE_ZONE}/${COMPUTE_INSTANCE}` )
  const zone = compute.zone(COMPUTE_ZONE)
  const [error, operation, response ] = await zone.vm(COMPUTE_INSTANCE).start()
  const something = await operation
  console.log(something)
  await sleep(1000)
  console.log( "> Instance started!" )
}

const http = require('http')
const express = require('express')
const app = express()
const CONFIG_JS = `window.URL_PING="${URL_PING}"\nwindow.URL_REDIRECT="${URL_REDIRECT}"\nwindow.SPINNER="${SPINNER}"`

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/',express.static('www'))
app.use('/config.js', (req,res) => res.send( CONFIG_JS ) )
app.use('/vm/start', (req,res) => {  } )

const server = http.createServer( app )
server.listen( PORT, () => console.log(`Serving on ${server.address().port}`) )