# Google Cloud Compute Engine Instance Starter

This is a tiny http server, which on hit from the browser will

* Raise pre-configured Google Cloud Compute Engine virtual machine instance.

* Ping a pre-configured endpoint on that instance once a second. You can pick your poison for a loading screen while you wait.

* Redirect you to same or another pre-configured url on the first successful response from the ping loop.

You can host this app somewhere always live and use it to raise your sleeping cloud environments without going through the slow GCP console or having to use the CLI.

You can even host this app on a separate, always live, cheapest possible gcloud compute instance (this is a simple app, it will run on a piece of gum, if you can connect a network cable to it) and use it to raise a second, more powerful vm, then automatically shut it down after you're done using it.

For automatically shutting down a Compute instance after X amount of idle time, you can check out [this repo.](https://github.com/codefleur/gcloud-stopper)