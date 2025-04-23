import { Injectable, OnModuleInit } from "@nestjs/common";
import { ControllerModel } from "./controller.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ControllerAlreadyExists,
  ControllerNotFoundException,
  FriendAlreadyExist,
} from "./exceptions";
import { RedisRepository } from "../../redis/domain/redis.repository";

@Injectable()
export class ControllerRepository implements OnModuleInit {
  constructor(
    @InjectModel(ControllerModel.name)
    private readonly controllerModel: Model<ControllerModel>,

    private readonly redisRepository: RedisRepository,
  ) { }

  async onModuleInit() {
    this.redisRepository.HDELALL(["connection-ws"]);
    await this.controllerModel.updateMany({}, { activeclient: "" });
  }

  async getAllActiveClients() {
    const controllers = await this.controllerModel.find({
      activeclient: { $ne: "" },
    });
    const activeClients = controllers.map(controller => ({
      controllerid: controller.controllerid,
      activeclient: controller.activeclient,
    }));

    return activeClients;
  }
  async selectActiveClient(clientid: string, controllerid: string) {
    await this.controllerModel.findOneAndUpdate(
      { controllerid },
      { activeclient: clientid },
    );

    await this.redisRepository.HSET(["connection-ws"], {
      [controllerid]: clientid,
    });
    // console.log(controller);
  }

  async getActiveClient(controllerid: string) {
    const cache = await this.redisRepository.HGET(
      ["connection-ws"],
      controllerid,
    );

    if (!cache) {
      const controller = await this.controllerModel.findOne({ controllerid });
      return controller?.activeclient;
    } else {
      return cache;
    }
  }

  async create(data: ControllerModel) {
    try {
      return await this.controllerModel.create(data);
    } catch (error: any) {
      if (error?.code === 11000) {
        // console.log(error);
        throw new ControllerAlreadyExists();
      }
      throw new Error("Failed to create controller");
    }
  }

  async addFriendToController(controllerid: string, clientid: string) {
    const controller = await this.controllerModel.findOne({ controllerid });
    if (!controller) throw new ControllerNotFoundException();

    if (controller.friends?.includes(clientid)) {
      throw new FriendAlreadyExist();
    }

    controller.friends?.push(clientid);
    await controller.save();
  }

  async updateController(controllerid: string, data: Partial<ControllerModel>) {
    await this.controllerModel.findOneAndUpdate({ controllerid }, { ...data });

    // if (!controller) throw new ControllerNotFoundException();

    // await controller.save();
  }

  async getControllerById(controllerid: string) {
    const controller = await this.controllerModel.findOne({ controllerid });

    // console.log("controller:", controller);
    if (!controller) throw new ControllerNotFoundException();
    return controller;
  }

  async getControllerByActiveClient(clientid: string) {
    return await this.controllerModel.findOne({ activeclient: clientid });
  }

  async getFriendsControllersByClientId(clientid: string) {
    return await this.controllerModel.find({
      friends: {
        $in: [clientid],
      },
    });
  }

  async deleteFriendFromController(controllerid: string, clientid: string) {
    const controller = await this.controllerModel.findOne({ controllerid });
    if (!controller) throw new ControllerNotFoundException();

    controller.friends = controller.friends?.filter(
      friend => friend !== clientid,
    );
    await controller.save();
  }

  async updatePermiumStatus(email: string, status: boolean) {
    await this.controllerModel.updateOne(
      { email },
      { $set: { premium: status } },
    );
  }
}
