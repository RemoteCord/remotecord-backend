import { LoggerService } from "@/src/modules/shared/providers";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { generateRandomHex } from "@/src/utils";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Injectable()
export class MessageBotGuard implements CanActivate, OnModuleInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async onModuleInit() {
    await this.redisRepository.HDELALL(["messages-bot"]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    const { messageid } = request.body as {
      messageid: string;
    };

    const hex = generateRandomHex();

    this.logger.info("Running message bot guard with id:", messageid);

    this.redisRepository.HSET(
      ["messages-bot"],
      {
        [hex]: messageid,
      },
      true,
    );

    request.headers["identifier"] = hex;

    // console.log("request:", request.body);
    return true;
  }
}
