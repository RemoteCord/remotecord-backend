import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import cookieParser from "cookie-parser";

import { AppModule } from "@/app/app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ["http://localhost:3007", "https://luqueee.dev"],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", "3000");
  app.use(cookieParser());

  await app.listen(port, "0.0.0.0");

  const logger = app.get(Logger);
  logger.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on("uncaughtException", handleError);
