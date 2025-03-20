import { Injectable } from "@nestjs/common";
import { ControllerModel } from "./controller.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ControllerAlreadyExists,
  ControllerNotFoundException,
  FriendAlreadyExist,
} from "./exceptions";

@Injectable()
export class ControllerRepository {
  constructor(
    @InjectModel(ControllerModel.name)
    private readonly controllerModel: Model<ControllerModel>,
  ) {}

  async selectActiveClient(clientid: string, controllerid: string) {
    const controller = await this.controllerModel.findOne({ controllerid });
    console.log(controller);
  }

  async resetAllActiveClients() {
    await this.controllerModel.updateMany({}, { activeclient: "" });
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
    await this.controllerModel
      .findOneAndUpdate({ controllerid }, { ...data })
      .catch(() => {
        throw new Error("Failed to update controller");
      });

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
}
