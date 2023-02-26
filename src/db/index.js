import lmdb from "node-lmdb";
import * as path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";

export const directory = path.join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "..",
  "storage",
  "db"
);

logger.info(`DB location path: ${directory}`);

export const dbEnv = new lmdb.Env();

dbEnv.open({
  path: directory,
  mapSize: 10 * 1024 * 1024,
  maxDbs: 128,
});

export const badRankingCreditsDatabase = dbEnv.openDbi({
  name: "badRankings",
  create: true,
});

export const brbDatabase = dbEnv.openDbi({
  name: "brb",
  create: true,
});

export const mutedDatabase = dbEnv.openDbi({
  name: "muted",
  create: true,
});
