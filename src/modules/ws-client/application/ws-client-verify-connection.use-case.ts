import { Injectable } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";

@Injectable()
export class WsClientVerifyConnectionUseCase {
  constructor(
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
    private readonly controllerRepository: ControllerRepository,
  ) {}

  async execute(tokenController: string, token: string) {
    if (!token) throw new Error("Token not provided");

    if (!tokenController) throw new Error("Controller ID TOKEN not provided");

    const { clientid } = this.clientDataEncryptUseCase.decryptUser(token);
    if (!clientid) {
      throw new Error("Invalid token");
    }

    const controllerid = this.clientDataEncryptUseCase.decrypt(tokenController);

    const controller =
      await this.controllerRepository.getControllerById(controllerid);

    if (!controller?.friends.includes(clientid))
      throw new Error(
        "Client not authorized to join controller (is not a friend)",
      );

    return { clientid, controllerid };
  }
}
