import { Injectable, Logger } from "@nestjs/common";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotWebcamsUseCase {
    private logger = new Logger("WsBotWebcamsUseCase");

    constructor(private readonly wsBotGateway: WsBotGateway) { }

    async sendWebcamsToBot(
        controllerid: string,
        identifier: string,
        webcams: {
            id: string,
            name: string;

        }[]
    ) {
        this.wsBotGateway.sendEventToBot(controllerid, "getWebcams", {
            messageid: identifier,
            webcams,
        });

    }

    async sendWebcamScreenshotToBot(
        controllerid: string,
        screenshot: Base64URLString,
    ) {
        this.wsBotGateway.sendEventToBot(controllerid, "getWebcamScreenshot", {
            screenshot,
        });
    }



}