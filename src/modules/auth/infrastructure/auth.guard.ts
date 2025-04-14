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

// import { User, UserSchema } from "@/src/repository/user.schema";

interface User {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger("AuthGuard");
  constructor(
    // private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly clientDataEncrypt: ClientDataEncryptUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: FastifyRequest = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

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
