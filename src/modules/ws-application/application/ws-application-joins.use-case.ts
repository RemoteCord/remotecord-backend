import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../domain/ws-application.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsApplicationVerifyConnectionUseCase } from "./ws-application-verify-connection.use-case";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";

@Injectable()
export class WsApplicationJoinsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly WsApplicationVerifyConnectionUseCase: WsApplicationVerifyConnectionUseCase,
    private readonly logger: LoggerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async execute(client: Socket) {
    console.log(client.handshake.headers);

    const { token } = client.handshake.auth as {
      token: string;
    };

    this.logger.info("Client joining application", token);

    const data = await this.WsApplicationVerifyConnectionUseCase.execute(token);
    const { clientid, email, username } = data;
    this.logger.info("Decrypted ws application token: ", JSON.stringify(data));
    const client_data = await this.userRepository.getUserById(clientid);

    if (!client_data) throw new ClientNotFoundException(clientid);

    this.logger.info(`Client connected with ID ${clientid} to application`);

    client.handshake.query["clientid"] = clientid;
    client.handshake.query["email"] = email;
    client.handshake.query["username"] = username;

    this.wsApplicationRepository.addClient(clientid, {
      socket: client,
      client_data,
    });

    this.redisRepository.setEntity(
      "client-data",
      clientid,
      JSON.stringify(client_data),
    );

    return { clientid };
  }
}
