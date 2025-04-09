import { Injectable, OnModuleInit } from "@nestjs/common";
import { CustomersModel } from "./customers.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RedisRepository } from "../../redis/domain/redis.repository";

@Injectable()
export class CustomersRepository implements OnModuleInit {
  constructor(
    @InjectModel(CustomersModel.name)
    private readonly customersModel: Model<CustomersModel>,

    private readonly redisRepository: RedisRepository,
  ) {}

  async onModuleInit() {
    // this.redisRepository.HDELALL(["connection-ws"]);
  }

  async getCustomerByEmail(email: string): Promise<CustomersModel | null> {
    const customer = await this.customersModel.findOne({
      email,
    });
    if (!customer) {
      return null;
    }
    return customer;
  }

  async createCustomer(data: CustomersModel) {
    const customer = new this.customersModel(data);
    await customer.save();
    return data;
  }
}
