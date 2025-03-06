import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "@/src/schemas/user.schema";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(user: User): Promise<User> {
    const userResult = await this.userModel.create(user);
    return userResult;
  }
}
