import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { UserModel } from "./user.schema";
import {
  ClientNotFoundException,
  UserAlreadyExistsException,
} from "./exceptions";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsApplicationRepository } from "@/src/modules/ws-application/domain/ws-application.repository";

@Injectable()
export class UserRepository {
  private logger = new Logger("UserRepository");

  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,

    @Inject(forwardRef(() => ClientDataEncryptUseCase))
    private readonly clientEncrypt: ClientDataEncryptUseCase,
    // private readonly logger: LoggerService,
  ) {}

  async createUser(user: UserModel): Promise<string> {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        this.logger.log(`Login from ${user.id}. Account already exists`);
        return this.clientEncrypt.encrypt(`
        ${user.id},
        ${user.email},
        ${user.name},
      `);
      }

      const result = await this.userModel.create(user);
      await result.save();
      this.logger.log(`User with id ${user.id} created`);

      const encryptToken = this.clientEncrypt.encrypt(`
        ${user.id},
        ${user.email},
        ${user.name},
      `);

      return encryptToken;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Error creating user:", errorMessage);
      throw new UserAlreadyExistsException();
    }
  }

  async updateUser(clientid: string, user: Partial<UserModel>): Promise<void> {
    try {
      // console.log("updateUser", clientid, user);
      const result = await this.userModel.findOneAndUpdate(
        { id: clientid },
        user,
        { new: true },
      );
      // console.log("result", result);
      if (!result) {
        throw new ClientNotFoundException();
      }

      this.logger.log(`User with id ${clientid} updated ${Object.keys(user)}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Error updating user:", errorMessage);
      throw new ClientNotFoundException();
    }
  }

  async getUserById(id: string): Promise<UserModel | null> {
    const user = await this.userModel.findOne({ id });

    if (!user) return null;

    this.logger.log(`Getting user with id ${id}`);
    return user;
  }
}
