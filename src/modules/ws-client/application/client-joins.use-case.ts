import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ClientDataEncryptUseCase } from "./client-data-encrypt.use-case";

@Injectable()
export class ClientJoinsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  async execute(client: Socket) {
    const { controllerid } = client.handshake.query as {
      controllerid: string;
    };

    const { token } = client.handshake.auth as {
      token: string;
    };

    if (!token) {
      client.disconnect();
      return;
    }

    const id = this.clientDataEncryptUseCase.decrypt(token);
    if (!id) {
      client.disconnect();
      return;
    }

    console.log("Client connected with ID:", id);
  }
}
