import * as winston from "winston";

export class LoggerService {
  private readonly instance: winston.Logger;

  public constructor() {
    const format = this.isProductionEnv()
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        );

    this.instance = winston.createLogger({
      level: "info",
      silent: this.isTestEnv(),
      format,
      transports: [
        new winston.transports.Console({
          stderrLevels: ["error"],
        }),
      ],
    });
  }

  public info(...message: unknown[]) {
    this.instance.info(message.join(" "));
  }

  public debug(...message: unknown[]) {
    this.instance.debug(message.join(" "));
  }

  public warn(...message: unknown[]) {
    this.instance.warn(message.join(" "));
  }

  public error(...message: unknown[]) {
    this.instance.error(message.join(" "));
  }

  private isTestEnv(): boolean {
    return process.env.NODE_ENV === "test";
  }

  private isProductionEnv(): boolean {
    return (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
    );
  }
}
