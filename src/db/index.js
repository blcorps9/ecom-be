import lowdb from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";

import { logger } from "../utils";

export default async function initDB(app, isDev) {
  const adapter = await new FileAsync("db.json");
  const db = lowdb(adapter);

  logger.info("Successfully connected to the db.");

  return db;
}
