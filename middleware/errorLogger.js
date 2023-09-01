const fs = require("fs");
const path = require("path");
const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logDirectory = "crash-logs";
fs.mkdirSync(logDirectory, { recursive: true });

const crashLogFormat = printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] ${level}: ${message}\n${stack}`;
});

const crashLogger = createLogger({
  format: combine(timestamp(), crashLogFormat),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "crash.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

const setupUnhandledExceptionLogging = () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    crashLogger.error("Uncaught Exception:", err);
    process.exit(1);
  });
};

module.exports = { setupUnhandledExceptionLogging };
