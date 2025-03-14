import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserModel } from "./user.schema";
import {
  ClientNotFoundException,
  UserAlreadyExistsException,
} from "./exceptions";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { LoggerService } from "@/src/modules/shared/providers";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    private readonly clientEncrypt: ClientDataEncryptUseCase,
    private logger: LoggerService,
  ) {}

  async createUser(user: UserModel): Promise<string> {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        this.logger.info(`Login from ${user.id}. Account already exists`);
        return this.clientEncrypt.encrypt(`
        ${user.id},
        ${user.email},
        ${user.name},
      `);
      }

      const result = await this.userModel.create(user);
      result.save();
      this.logger.info(`User with id ${user.id} created`);

      const encryptToken = this.clientEncrypt.encrypt(`
        ${user.id},
        ${user.email},
        ${user.name},
      `);

      // this.logger.info("Encrypted token:", encryptToken);
      return encryptToken;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Error creating user:", errorMessage);
      throw new UserAlreadyExistsException();
    }
  }

  async updateUser(clientid: string, user: UserModel): Promise<void> {
    try {
      await this.userModel.updateOne({ id: clientid }, user);
      this.logger.info(`User with id ${clientid} updated`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Error updating user:", errorMessage);
    }
  }
  async getUserById(id: string): Promise<UserModel | null> {
    const user = await this.userModel.findOne({ id });

    if (!user) return null;

    this.logger.info(`Getting user with id ${id}`);
    return user;
  }
}
