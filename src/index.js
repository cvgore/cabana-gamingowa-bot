import {init as initRest} from "./rest.js";
import {init as initClient} from "./client.js";
import schedule from "node-schedule";
import * as http from "http";
import { COMMIT_HASH, STARTUP_DATE } from "./env.js";

initRest()
initClient()

process.on('SIGINT', function () {
  schedule.gracefulShutdown()
    .then(() => process.exit(0))
})

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    version: COMMIT_HASH,
    uptime: STARTUP_DATE
  }));
}).listen(14587);