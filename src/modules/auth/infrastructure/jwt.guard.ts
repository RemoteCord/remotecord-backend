import {
  CanActivate,
  ExecutionContext,
  Injectable,
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
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = request.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new CustomUnathorizedException();
    }

    console.log("JwtAuthGuard canActivate called");

    return super.canActivate(context);
  }

  handleRequest(err: unknown, user: any, info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    console.log("JwtAuthGuard handleRequest called");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const endpoint = user.aud[1];

    request.headers["aud"] = endpoint;

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
    )
      .then(async response => {
        // console.log("response", response);
        if (!response.ok) {
          throw new CustomUnathorizedException();
        }

        const res = await response.json();

        return res;
      })
      .catch(error => {
        throw new CustomUnathorizedException();
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
