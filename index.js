const PING_URL = process.env.PING_URL
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

  while( true )
  {
    await sleep(100)
    try { 
      let response = await fetch(PING_URL,{timeout:900})
      let text = await response.text()
      console.log( `> Response received: ${text}` )
      break
    }
    catch( e ) { console.error(e.message) }
  }

  console.log( "> Instance started!" )
}

startInstance()
