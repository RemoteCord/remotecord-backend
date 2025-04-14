import { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class CommandsRepository implements OnModuleInit {
  constructor(private readonly redisRepository: RedisRepository) {}

  async onModuleInit() {
    // await this.redisRepository.HDELALL(["client-commands-requests"]);
  }

  async createCommandEvent(clientid: string, command: Permissions) {
    const redisData = await this.redisRepository.HGET(
      ["client-commands-requests"],
      clientid,
    );
    let clientCommands = redisData ? JSON.parse(redisData) : [];
    // console.log("clientCommands", clientCommands);
    clientCommands.push(command);

    this.redisRepository.HSET(["client-commands-requests"], {
      clientid: JSON.stringify(clientCommands),
    });
  }

  async verifyPermissionEvent(clientid: string, command: Permissions) {
    const redisData = await this.redisRepository.HGET(
      ["client-commands-requests"],
      clientid,
    );
    let clientCommands = redisData ? JSON.parse(redisData) : [];
    // console.log("clientCommands", clientCommands);
    return clientCommands.includes(command);
  }

  async deleteCommandEvent(clientid: string, command: Permissions) {
    const redisData = await this.redisRepository.HGET(
      ["client-commands-requests"],
      clientid,
    );
    let clientCommands = redisData ? JSON.parse(redisData) : [];

    const index = clientCommands.findIndex((c: Permissions) => c === command);
    if (index !== -1) {
      clientCommands.splice(index, 1);
    }

    this.redisRepository.HSET(["client-commands-requests"], {
      [clientid]: JSON.stringify(clientCommands),
    });
  }
}
