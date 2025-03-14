import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import cookieParser from "cookie-parser";
import multiPart from "@fastify/multipart";

import { AppModule } from "./app/app.module";
import { CorsOptions } from "./cors";

declare const module: any;

async function bootstrap() {
  const fastifyModule = new FastifyAdapter({
    bodyLimit: 1024 * 1024 * 1024, // 1GB
    debugger: true,
  });

  // await fastifyModule.register(cors, CorsOptions);
  // await fastifyModule.register(helmet);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyModule,
  );

  // await app.register(cors, CorsOptions);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", "3000");

  app.use(cookieParser());

  await app.register(multiPart, {
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1GB
    },
  });

  app.enableCors(CorsOptions);

  await app.listen(port, "0.0.0.0");

  const logger = new Logger("Main");
  logger.log(`App is ready and listening on port ${port} 🚀`);

  if (typeof module !== "undefined" && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", handleError);
