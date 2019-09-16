const PORT = process.env.PORT || 1337
const URL_PING = process.env.URL_PING || "http://gccxpi.duckdns.org/"
const URL_REDIRECT = process.env.URL_REDIRECT || "http://gccxpi.duckdns.org/"
const COMPUTE_ZONE = process.env.COMPUTE_ZONE
const COMPUTE_INSTANCE = process.env.COMPUTE_INSTANCE

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

  // while( true )
  // {
  //   await sleep(100)
  //   try { 
  //     let response = await fetch(URL_PING,{timeout:900})
  //     let text = await response.text()
  //     console.log( `> Response received: ${text}` )
  //     break
  //   }
  //   catch( e ) { console.error(e.message) }
  // }

  console.log( "> Instance started!" )
}

// const WebSocketServer = require('websocket').server;
// const https = require('https')
const http = require('http')
const express = require('express')
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/',express.static('www'))
app.use('/start',(req,res)=>{
  startInstance()
  let html = `
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script>
    function ping() { $.ajax({ url:"${URL_PING}", error:console.warn, success: onReady, timeout: 1000 }) }
    function onReady() { window.location.href="${URL_REDIRECT}" }
    ping()
    setInterval( ping, 2000 )
  </script>`
  res.send(html)
})

const server = http.createServer( app )
server.listen( PORT, () => console.log(`Serving on ${server.address().port}`) )

// let wsServer = new WebSocketServer({ httpServer: server })

// wsServer.on('request', function(request) {
//   var connection = request.accept(null, request.origin);
//   connection.on('message', function(message) {
//     if (message.type === 'utf8') {
//       // process WebSocket message
//     }
//   });
//   connection.on('close', function(connection) {
//     // close user connection
//   });
// } )
