import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserModel } from "./user.schema";
import { UserAlreadyExistsException } from "./exceptions";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async createUser(user: UserModel) {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) return existingUser;

      const result = await this.userModel.create(user);
      result.save();
      console.log("User created:", result);
      return result;
    } catch (error) {
      console.log("Error creating user:", error);
      throw new UserAlreadyExistsException();
    }
  }
}
