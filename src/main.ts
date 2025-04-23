import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import cookieParser from "cookie-parser";
import multiPart from "@fastify/multipart";
// import rawBody from "@fastify/raw-body";
import { AppModule } from "./app/app.module";
import { CorsOptions } from "./cors";
// import { RedisIoAdapter } from "./adapters/redis-io.adapter";
import * as Sentry from "@sentry/nestjs";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { RedisIoAdapter } from "./adapters/redis-io.adapter";
import { AppClusterService } from "./modules/app_cluster.service";
// import { WsAdapter } from "@nestjs/platform-ws";

// declare const module: any;

async function bootstrap() {
  const fastifyModule = new FastifyAdapter({
    //@ts-ignore
    debugger: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyModule,
    {
      rawBody: true,
    },
  );

  // await app.register(cors, CorsOptions);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // app.useWebSocketAdapter(new IoAdapter(app));

  // Sentry.init({
  //   dsn: "http://c5a0a09143ef4403899de95a30a54a06@192.168.192.84:8000/1",
  //   // integrations: [Sentry.captureConsoleIntegration()],
  //   //   release: "1.0.0",
  //   environment: "production",
  //   //   maxBreadcrumbs: 50,
  // });

  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", "3000");

  app.use(cookieParser());

  //@ts-ignore
  await app.register(multiPart, {
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1GB
    },
  });

  app.enableCors(CorsOptions);

  await app.listen(port, "0.0.0.0");

  const logger = new Logger("Main");
  logger.log(`App is ready and listening on port ${port} 🚀`);

  // if (typeof module !== "undefined" && module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}

bootstrap().catch(handleError);
// AppClusterService.clusterize(bootstrap);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally terminate the process
  // process.exit(1);
});
