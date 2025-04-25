import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { InjectModel } from "@nestjs/mongoose";
import { FastifyRequest } from "fastify";
// import { UserModel } from 'src/schemas/user.schema';
import { Model, Types } from "mongoose";
import { LoggerService } from "../../shared/providers";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { CustomUnathorizedException } from "./exceptions";
import { ClientDataEncryptUseCase } from "../application/client-data-encrypt.use-case";
import { AuthGuard } from "@nestjs/passport";
import { jwtDecode } from "jwt-decode";
import type { User } from "./auth.guard";

export interface JWTUser {
  clientid: string;
  username: string;
  picture: string;
  email: string;
}

// import { User, UserSchema } from "@/src/repository/user.schema";
@Injectable()
export class JwtAuthGuard {
  private logger = new Logger("JwtAuthGuard");
  constructor(
    // private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly clientDataEncrypt: ClientDataEncryptUseCase,
  ) {
  }
  async canActivate(context: ExecutionContext) {
    try {
      // Add your custom authentication logic here
      // for example, call super.logIn(request) to establish a session.
      const request = context.switchToHttp().getRequest<FastifyRequest>();

      const token = request.headers["authorization"]?.split(" ")[1];
      if (!token) {
        throw new CustomUnathorizedException();
      }

      this.logger.log(`Running JwtAuthGuard`);

      // console.log("JwtAuthGuard canActivate called");

      const user_data = await jwtDecode(token) as User;

      const clientid = user_data.sub as string;

      const existUser = await this.userRepository.getUserById(clientid);
      // console.log("user_data_db", user_data_db);
      if (existUser) {
        // console.log("user_data_db", user_data_db);
        // this.logger.error("No user found in request");
        const { email, name, picture, sub } = user_data;

        request.headers["email"] = email;
        request.headers["username"] = name;
        request.headers["picture"] = picture;
        request.headers["clientid"] = sub
        this.logger.log(`passed jwt guard ${clientid} ${name}`);

        return true;
      }


      this.logger.error("No user found in request. JwtAuthGuard Failed");
      return false;
    } catch (error) {

      return false
    }
  }

  async decryptData(token: string): Promise<JWTUser | null> {
    try {
      const data = await jwtDecode(token) as User;
      return {
        ...data,
        clientid: data.sub,
        username: data.name,
      };
    } catch (error) {
      // this.logger.error("Error decrypting data", error);
      // throw new CustomUnathorizedException();
      return null
    }
    // return data;
  }



}
