import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Logger } from "@nestjs/common";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | undefined;
  private readonly logger = new Logger("RedisIoAdapter");

  // In src/adapters/redis-io.adapter.ts
async connectToRedis(): Promise<void> {
  try {
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      // Don't specify DB for PubSub
    });

    // Add error handlers
    pubClient.on('error', (err) => {
      this.logger.error(`Redis Pub Client Error: ${err.message}`);
    });

    const subClient = pubClient.duplicate();
    subClient.on('error', (err) => {
      this.logger.error(`Redis Sub Client Error: ${err.message}`);
    });

    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log("Redis adapter initialized successfully");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to connect to Redis: ${errorMessage}`);
    throw error;
  }
}

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    try {
      server.adapter(this.adapterConstructor);
      return server;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(`Failed to set Redis adapter: ${errorMessage}`);
      throw error;
    }
  }
}
