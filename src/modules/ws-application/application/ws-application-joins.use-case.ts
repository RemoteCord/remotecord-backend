import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../domain/ws-application.repository";
import { UserRepository } from "@/src/repository/user/user.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";
import { WsApplicationVerifyConnectionUseCase } from "./ws-application-verify-connection.use-case";

@Injectable()
export class WsApplicationJoinsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wsApplicationRepsitory: WsApplicationRepository,
    private readonly WsApplicationVerifyConnectionUseCase: WsApplicationVerifyConnectionUseCase,
    private readonly logger: LoggerService,
  ) {}

  async execute(client: Socket) {
    try {
      const { token } = client.handshake.auth as {
        token: string;
      };

      this.logger.info("Client joining application", token);

      const clientid =
        await this.WsApplicationVerifyConnectionUseCase.execute(token);

      const client_data = await this.userRepository.getUserById(clientid);

      if (!client_data) throw new ClientNotFoundException(clientid);

      this.logger.info(`Client connected with ID ${clientid} to application`);

      client.handshake.query["clientid"] = clientid;

      this.wsApplicationRepsitory.addClient(clientid, {
        socket: client,
        client_data,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
