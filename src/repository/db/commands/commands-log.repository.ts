import { Injectable } from "@nestjs/common";
import { CommandsModel } from "./commands.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RedisRepository } from "../../redis/domain/redis.repository";

@Injectable()
export class CommandsLogsRepository {
  constructor(
    @InjectModel(CommandsModel.name)
    private readonly commandsModel: Model<CommandsModel>,

    private readonly redisRepository: RedisRepository,
  ) { }

  async createCommandLog(
    controllerid: string,
    clientid: string,
    command: string,
  ) {
    const commandLog = new this.commandsModel({
      controllerid,
      clientid,
      command,
      timestamp: new Date(),
    });
    await commandLog.save();
  }

  async countCommands() {
    const count = await this.commandsModel.countDocuments();
    return count;
  }



}
