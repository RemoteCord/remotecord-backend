import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { WsClientRepository } from "../domain/ws-client.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsClientVerifyConnectionUseCase } from "./ws-client-verify-connection.use-case";
import { WsBotConnectClientUseCase } from "../../ws-bot/application/events/ws-bot-connect-client.use-case";
import { WsApplicationRepository } from "../../ws-application/domain/ws-application.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
@Injectable()
export class WsClientJoinsUseCase {
  private logger = new Logger("WsClientJoinsUseCase");
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly userRepository: UserRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly wsClientVerifyConnectionUseCase: WsClientVerifyConnectionUseCase,
    private readonly wsBotConnectClientUseCase: WsBotConnectClientUseCase,
    private readonly redisRepository: RedisRepository,
  ) {}

  async execute(client: Socket) {
    const { controllerid, identifier } = client.handshake.query as {
      controllerid: string;
      identifier: string;
    };

    const { token, tokenConnection } = client.handshake.auth as {
      token: string;
      tokenConnection: string;
    };

    // console.log(client.handshake.query);

    const { clientid } = await this.wsClientVerifyConnectionUseCase.execute(
      controllerid,
      token,
    );

    this.logger.log(`Client ${clientid} joining controller ${controllerid}`);

    const tokenConnectionCache = await this.redisRepository.HGET(
      ["token-connections"],
      controllerid,
    );

    if (tokenConnectionCache !== tokenConnection) {
      this.logger.error(`Token connection ${tokenConnection} not valid`);
      throw new Error("Token connection not valid");
    }

    const client_data = await this.userRepository.getUserById(clientid);

    if (!client_data) throw new ClientNotFoundException(clientid);

    // this.logger.log(
    //   `Client connected with ID ${clientid} to controller ${controllerid}`,
    // );

    client.handshake.query["clientid"] = clientid;
    client.handshake.query["controllerid"] = controllerid;

    await this.redisRepository.HSET(["connection-ws"], {
      [controllerid]: clientid,
    });

    const client_data_redis = await this.redisRepository.HGET(
      ["client-data"],
      clientid,
    );

    // console.log("client_data_redis", client_data_redis);

    if (client_data_redis) {
      const parsedClientData = JSON.parse(client_data_redis) as {
        clientid: string;
        email: string;
        name: string;
      };
      await this.redisRepository.HSET(["client-data"], {
        [clientid]: JSON.stringify({
          ...parsedClientData,
          controllerid,
        }),
      });
    }

    await this.controllerRepository.selectActiveClient(clientid, controllerid);
    await this.wsBotConnectClientUseCase.execute({
      controllerid,
      clientid,
      identifier,
    });

    return { clientid };
  }
}
