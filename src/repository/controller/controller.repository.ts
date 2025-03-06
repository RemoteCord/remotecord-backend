import { Injectable } from "@nestjs/common";
import { ControllerModel } from "./controller.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ControllerAlreadyExists } from "./exceptions";

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

  async createController(controller: ControllerModel) {
    try {
      return await this.controllerModel.create(controller);
    } catch (error) {
      throw new ControllerAlreadyExists();
    }
  }
}
