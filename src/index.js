require("dotenv").config();

const startServer = require("./app").default;

startServer();

function cleanup() {
  process.exit();
}

//do something when app is closing
process.on("exit", cleanup);

//catches ctrl+c event
process.on("SIGINT", cleanup);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", cleanup);
process.on("SIGUSR2", cleanup);

//catches uncaught exceptions
process.on("uncaughtException", cleanup);
