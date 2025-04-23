import { Global, Logger, LogLevel, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { LogInterceptor } from "./interceptors";
import { LoggerService } from "./providers/logger.service";
import { LoggerMiddleware } from "./middlewares/logger.middleware";

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (configService: ConfigService) => {
    const level = configService.get<LogLevel>("LOGGER_LEVEL", "log");
    const logger = new Logger();
    logger.localInstance.setLogLevels?.([level]);
    return logger;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [],
  providers: [loggerProvider, LoggerService, LogInterceptor, LoggerMiddleware],
  exports: [loggerProvider, LoggerService, LogInterceptor],
})
export class SharedModule { }
