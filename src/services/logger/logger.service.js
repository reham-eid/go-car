import winston from "winston";
import path from "path";
// date + LoggerLevel + message
const dateFormate = () => {
  return new Date(Date.now()).toLocaleString();
};
export class LoggerService {
  constructor(route) {
    const logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.printf((info) => {
        let message = `${dateFormate()} | ${info.level.toUpperCase()} | ${
          info.message
        } | `;
        message = info.obj
          ? message + `data ${JSON.stringify(info.obj)} | `
          : message;
        return message;
      }),
      transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({
          filename: path.resolve(`src/services/logger/log/${route}.log`),
          level: "info",
        }),
      ],
    });

    this.logger = logger;
  }

  async info(message) {
    this.logger.log("info", message);
  }
  async info(message, obj) {
    this.logger.log("info", message, { obj });
  }
  async error(message) {
    this.logger.log("error", message);
  }
  async error(message) {
    this.logger.log("error", message, { obj });
  }
  async debug(message) {
    this.logger.log("debug", message);
  }
  async debug(message) {
    this.logger.log("debug", message, { obj });
  }
}
