import { LoggerService } from "@/src/modules/shared/providers";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { generateRandomHash } from "@/src/utils";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Injectable()
export class MessageBotGuard implements CanActivate, OnModuleInit {
  private logger = new Logger("ControllerGuard");
  constructor(private readonly redisRepository: RedisRepository) {}

  async onModuleInit() {
    await this.redisRepository.HDELALL(["messages-bot"]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    const { messageid } = request.body as {
      messageid: string;
    };

    const url = request.url.split("/");

    const lastElement = url[url.length - 1];

    const hex = generateRandomHash();

    this.redisRepository.HSET(
      ["messages-bot"],
      {
        [hex]: messageid,
      },
      true,
    );

    request.headers["identifier"] = hex;

    this.logger.log(
      `Called endpoint ${lastElement} Running message bot guard with id: ${messageid}`,
    );
    // console.log("request:", request.body);
    return true;
  }
}
