import pino from "pino";
import pinoDebug from 'pino-debug'
export const logger = pino(
  {level: process.env.LOG_LEVEL || 'info'}
)

pinoDebug(logger)