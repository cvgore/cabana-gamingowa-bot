import {init as initRest} from "./rest.js";
import {init as initClient} from "./client.js";
import schedule from "node-schedule";

initRest()
initClient()

process.on('SIGINT', function () {
  schedule.gracefulShutdown()
    .then(() => process.exit(0))
})