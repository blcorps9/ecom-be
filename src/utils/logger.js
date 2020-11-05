import path from "path";
import winston from "winston";

import { isDev } from "../config";

const epoch = Date.now();
const errorFile = path.join(process.cwd(), `logs/${epoch}-error.log`);
const logFile = path.join(process.cwd(), `logs/${epoch}-combined.log`);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: errorFile, level: "error" }),
    new winston.transports.File({ filename: logFile }),
  ],
});

if (isDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
