import { Injectable } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { JwtAuthGuard } from "../../auth/infrastructure/jwt.guard";

@Injectable()
export class WsClientVerifyConnectionUseCase {
  constructor(
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
    private readonly controllerRepository: ControllerRepository,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {}

  async execute(controllerid: string, token: string) {
    console.log("WS CLIENT VERIFY", token, controllerid);
    if (!token) throw new Error("Token not provided");
    if (!controllerid) throw new Error("Controller ID not provided");

    const data = await this.jwtAuthGuard.decryptData(token);

    const { clientid } = data;
    if (!clientid) {
      throw new Error("Invalid token");
    }

    // const controllerid = this.clientDataEncryptUseCase.decrypt(tokenController);

    const controller =
      await this.controllerRepository.getControllerById(controllerid);

    if (!controller?.friends?.includes(clientid))
      throw new Error(
        "Client not authorized to join controller (is not a friend)",
      );

    return { clientid };
  }
}
