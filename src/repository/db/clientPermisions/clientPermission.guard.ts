import { CustomUnathorizedException } from "@/src/modules/auth/infrastructure/exceptions";
import { LoggerService } from "@/src/modules/shared/providers";
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { FastifyRequest } from "fastify";
// import { UserModel } from 'src/schemas/user.schema';
import { CustomNotAllowedException } from "./exceptions/customNotAllowed";
import { ControllerRepository } from "../controller/controller.repository";
import { ClientPermissionRepository } from "./clientPermission.repository";
import { RedisRepository } from "../../redis/domain/redis.repository";
import { permissionsAdapter } from "./clientPermission.constants";
import { CommandsLogsRepository } from "../commands/commands-log.repository";
// import { User, UserSchema } from "@/src/repository/user.schema";

@Injectable()
export class ClientPermissionGuard implements CanActivate {
  private logger = new Logger("ClientPermissionGuard");

  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly clientPermissionRepository: ClientPermissionRepository,
    private readonly redisRepository: RedisRepository,
    private readonly commandsLogsRepository: CommandsLogsRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: FastifyRequest = context.switchToHttp().getRequest();
      //   console.log("request:", request);

      const urlParts = request.url.split("/");
      const lastElement = urlParts[urlParts.length - 1].split("?")[0];
      const controllerid = urlParts[urlParts.length - 2];
      // this.logger.log("Running client permission guard", lastElement);
      const activeClientId = await this.redisRepository.HGET(
        ["connection-ws"],
        controllerid,
      );

      if (!activeClientId) {
        this.logger.error("Active client not found");
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `ctive client not found`,
          },
          HttpStatus.CONFLICT,
          {
            cause: `Active client not found`,
          },
        );
      }

      const adaptedPermission = permissionsAdapter[lastElement];
      if (!adaptedPermission) {
        // this.logger.error("Permission not found", lastElement);
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

      const permissionsRedisReq = await this.redisRepository.HGET(
        ["permissions", [activeClientId, controllerid]],
        adaptedPermission,
      );

      const permissionRedis = permissionsRedisReq === "true" ? true : false;
      // console.log("permissionsRedis", permissionsRedis);

      let permission = false;

      if (!permissionRedis) {
        permission = await this.clientPermissionRepository.getPermission(
          activeClientId,
          controllerid,
          adaptedPermission,
        );
      } else {
        permission = permissionRedis;
      }

      // const permission = JSON.parse(permissionRedis);

      // this.logger.info("Permission", permission);

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
            status: HttpStatus.CONFLICT,
            error: errorMessage,
          },
          HttpStatus.CONFLICT,
          {
            cause: errorMessage,
          },
        );
      }

      const redisData = await this.redisRepository.HGET(
        ["client-commands-requests"],
        activeClientId,
      );
      let clientCommands = redisData ? JSON.parse(redisData) : [];

      clientCommands.push(adaptedPermission);

      await this.redisRepository.HSET(["client-commands-requests"], {
        [activeClientId]: JSON.stringify(clientCommands),
      });

      await this.commandsLogsRepository.createCommandLog(
        controllerid,
        activeClientId,
        adaptedPermission,
      )

      this.logger.log(
        `Passed ClientPermissionGuard for command ${adaptedPermission} from ${controllerid} to ${activeClientId}`,
      );


      return true;
    } catch (error) {
      this.logger.error(
        `Error in permission guard: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Error checking permissions",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
