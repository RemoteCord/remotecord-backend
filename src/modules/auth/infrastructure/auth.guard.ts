import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { InjectModel } from "@nestjs/mongoose";
// import { UserModel } from 'src/schemas/user.schema';
import { Model, Types } from "mongoose";

import { User, UserSchema } from "@/src/schemas/user.schema";
import { FastifyRequest } from "fastify";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // private readonly logger: LoggerService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // console.log('context:', context);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request: FastifyRequest = context.switchToHttp().getRequest();
      //   const token = this.extractTokenFromHeader(request);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // this.logger.info('TOKEN REQUEST:', token);
      console.log("req", request);
      //   if (!token) {
      //     // this.logger.error("No token found in request");
      //     throw new UnauthorizedException();
      //   }

      //   const result = await this.verifyToken(token);
      //   //   request["user"] = result;
      // this.logger.info('token:', token);

      return true;
    } catch (error) {
      //   this.logger.error("Error:", error);
      console.log("Error:", error);
      throw new UnauthorizedException();
    }
  }

  async verifyToken(token: string) {
    try {
      // const { data, error } = await supabaseClient.auth.getUser(token);

      return "";
    } catch (error) {
      return new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException();

    const [type, token] = authorization.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
