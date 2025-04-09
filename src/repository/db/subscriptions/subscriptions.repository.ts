import { Injectable, OnModuleInit } from "@nestjs/common";
import { SubscriptionsModel } from "./subscriptions.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RedisRepository } from "../../redis/domain/redis.repository";

@Injectable()
export class SubscriptionsRepository implements OnModuleInit {
  constructor(
    @InjectModel(SubscriptionsModel.name)
    private readonly subscriptionModel: Model<SubscriptionsModel>,

    private readonly redisRepository: RedisRepository,
  ) {}

  async onModuleInit() {
    // this.redisRepository.HDELALL(["connection-ws"]);
  }

  async createSubscription(data: SubscriptionsModel) {
    const subscription = new this.subscriptionModel(data);
    await subscription.save();
  }

  async getSubscriptionByCustomerId(
    customerId: string,
  ): Promise<SubscriptionsModel | null> {
    const subscription = await this.subscriptionModel.findOne(
      {
        customerid: customerId,
      },
      {
        _id: 0,
        __v: 0,
      },
    );
    if (!subscription) {
      return null;
    }
    return subscription;
  }

  async deleteSubscriptionById(subscriptionId: string) {
    const subscription = await this.subscriptionModel.findOneAndDelete({
      subscriptionid: subscriptionId,
    });
    if (!subscription) {
      return null;
    }
    return subscription;
  }
}
