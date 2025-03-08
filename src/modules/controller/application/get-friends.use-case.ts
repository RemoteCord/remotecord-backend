import { LoggerService } from "@/src/modules/shared/providers";
import { WsApplicationRepository } from "@/src/modules/ws-application/domain/ws-application.repository";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetFriendsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
    private readonly wsApplicationRepository: WsApplicationRepository,
  ) {}
  async execute(controllerid: string) {
    try {
      const { friends } =
        await this.controllerRepository.getControllerById(controllerid);

      // console.log("controller:", controller);

      this.logger.info(
        `Getting friends for controller ${controllerid} ${friends}`,
      );

      const friendsResult = await Promise.all(
        friends.map(async friend => {
          const active = await this.wsApplicationRepository.getClient(friend);
          // console.log("active:", active);
          return {
            clientid: friend,
            isactive: active ? true : false,
          };
        }),
      );

      console.log("friendsResult:", friendsResult);

      return {
        clients: friendsResult,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error getting active client from controller ${controllerid}: ${errorMessage}`,
      );

      return { clients: [] };
    }
  }
}
