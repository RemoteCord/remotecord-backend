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

// import { User, UserSchema } from "@/src/repository/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly clientDataEncrypt: ClientDataEncryptUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: FastifyRequest = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        // this.logger.error("No token found in request");
        throw new Error("Token not found");
      }

      const endpoint = request.headers["aud"] as string;
      // console.log("endpoint", endpoint, token);
      if (!endpoint) return false;

      // Parse JWT if it's a string
      const user_data = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async response => {
          // console.log("response", response);
          if (!response.ok) {
            throw new CustomUnathorizedException();
          }

          const res = await response.json();

          return res;
        })
        .catch(error => {
          console.log("error", error);
          throw new CustomUnathorizedException();
        });

      console.log("user_data", user_data);
      request.headers["user"] = user_data;

      // console.log("req", request);

      //   const result = await this.verifyToken(token);
      //   //   request["user"] = result;
      // this.logger.info('token:', token);

      // const data = this.clientDataEncrypt.decryptUser(token);
      // const { clientid, email, username } = data;
      const { sub: clientid, email, name, picture } = user_data;

      // this.logger.info("clientid:", clientid, email);

      request.headers["clientid"] = clientid.split("|")[1];
      request.headers["email"] = email;
      request.headers["username"] = name;
      request.headers["picture"] = picture;

      return true;
    } catch (error: unknown) {
      //   this.logger.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error Auth Guard:", errorMessage);
      throw new CustomUnathorizedException();
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException();

    const [type, token] = authorization.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
