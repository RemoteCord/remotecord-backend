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

export interface JWTUser {
  clientid: string;
  given_name: string;
  family_name: string;
  nickname: string;
  username: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

// import { User, UserSchema } from "@/src/repository/user.schema";
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private logger = new Logger("JwtAuthGuard");
  constructor(
    // private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly clientDataEncrypt: ClientDataEncryptUseCase,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = request.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new CustomUnathorizedException();
    }

    this.logger.log(`Running JwtAuthGuard`);

    // console.log("JwtAuthGuard canActivate called");

    await super.canActivate(context);

    const clientid = request.headers["clientid"] as string;

    // console.log("JwtAuthGuard canActivate called", data, clientid);
    const user_data_db = await this.userRepository.getUserById(clientid);
    // console.log("user_data_db", user_data_db);
    if (user_data_db) {
      // console.log("user_data_db", user_data_db);
      // this.logger.error("No user found in request");
      const { email, name, avatar } = user_data_db;

      request.headers["email"] = email;
      request.headers["username"] = name;
      request.headers["picture"] = avatar;
      return true;
    }

    const user = await this.decryptData(token);

    // console.log("user", user);

    if (user) {
      request.headers["email"] = user.email;
      request.headers["username"] = user.username;
      request.headers["picture"] = user.picture;
      request.headers["clientid"] = user.clientid;
      return true;
    }
    this.logger.error("No user found in request. JwtAuthGuard Failed");
    return false;
  }

  handleRequest(err: unknown, user: any, info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    this.logger.log("JwtAuthGuard handleRequest called");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const endpoint = user.aud[1];

    request.headers["aud"] = endpoint;
    request.headers["clientid"] = user.sub.split("|")[1];

    return user;
  }

  async decryptData(token: string): Promise<JWTUser> {
    const data = await fetch(
      "https://dev-biek8mtlp8iyekxa.us.auth0.com/userinfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(async response => {
      // console.log("response", response);
      if (!response.ok) {
        throw new CustomUnathorizedException();
      }

      const res = await response.json();

      return res;
    });

    const formattedSub = data.sub.split("|")[1];

    return {
      ...data,
      clientid: formattedSub,
      username: data.name,
    };
    // return data;
  }
}
