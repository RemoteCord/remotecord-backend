import { CustomUnathorizedException } from "@/src/modules/auth/infrastructure/exceptions";
import { LoggerService } from "@/src/modules/shared/providers";
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { InjectModel } from "@nestjs/mongoose";
import { FastifyRequest } from "fastify";
// import { UserModel } from 'src/schemas/user.schema';
import { Model, Types } from "mongoose";
import type { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";
import { CustomNotAllowedException } from "./exceptions/customNotAllowed";
import { ControllerRepository } from "../controller/controller.repository";
import { ClientPermissionRepository } from "./clientPermission.repository";
import { RedisRepository } from "../../redis/domain/redis.repository";
// import { User, UserSchema } from "@/src/repository/user.schema";

const permissionsAdapter: Record<string, Permissions> = {
  "upload-file": "uploadFile",
  "get-screens": "screenshot",
  "send-screenshot": "screenshot",
  explorer: "explorer",
  file: "getFile",
  tasks: "process",
  cmd: "shell",
};

@Injectable()
export class ClientPermissionGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly clientPermissionRepository: ClientPermissionRepository,
    private readonly redisRepository: RedisRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: FastifyRequest = context.switchToHttp().getRequest();
      //   console.log("request:", request);

      const urlParts = request.url.split("/");
      const lastElement = urlParts[urlParts.length - 1];
      const controllerid = urlParts[urlParts.length - 2];
      this.logger.info("Running client permission guard", lastElement);
      const controller =
        await this.controllerRepository.getControllerById(controllerid);

      if (!controller || !controller.activeclient) {
        this.logger.error("Controller not found");
        throw new CustomUnathorizedException();
      }

      const activeClientId = controller.activeclient;

      const adaptedPermission = permissionsAdapter[lastElement];
      if (!adaptedPermission) {
        this.logger.error("Permission not found", lastElement);
        throw new CustomNotAllowedException(
          activeClientId,
          controllerid,
          adaptedPermission,
        );
      }

      // const permission = await this.clientPermissionRepository.getPermission(
      //   activeClientId,
      //   controllerid,
      //   adaptedPermission,
      // );

      const permissionsRedis = await this.redisRepository.getEntity(
        "permissions",
        `${activeClientId}:${controllerid}`,
      );

      let permission = false;

      if (!permissionsRedis) {
        permission = await this.clientPermissionRepository.getPermission(
          activeClientId,
          controllerid,
          adaptedPermission,
        );
      } else {
        const permissions = JSON.parse(permissionsRedis);
        console.log("permissions", permissions);
        permission = permissions[adaptedPermission];
      }

      // const permission = JSON.parse(permissionRedis);

      this.logger.info("Permission", permission);

      const errorMessage = `Not allowed for permission ${adaptedPermission} by clientid ${activeClientId}`;

      if (!permission) {
        this.logger.error(adaptedPermission, errorMessage);
        // throw new CustomNotAllowedException(
        //   activeClientId,
        //   controllerid,
        //   adaptedPermission,
        // );

        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: errorMessage,
          },
          HttpStatus.FORBIDDEN,
          {
            cause: errorMessage,
          },
        );
      }

      return true;
    } catch (error: unknown) {
      //   this.logger.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error Auth Guard:", errorMessage);
      throw new CustomUnathorizedException();
    }
  }
}
