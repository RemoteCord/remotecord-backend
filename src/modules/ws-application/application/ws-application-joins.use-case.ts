import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { JwtAuthGuard } from "../../auth/infrastructure/jwt.guard";

@Injectable()
export class WsApplicationJoinsUseCase {
  private logger = new Logger("WsApplicationJoinsUseCase");
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisRepository: RedisRepository,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) { }

  async execute(client: Socket) {
    // console.log(client.handshake.headers);

    const { token } = client.handshake.auth as {
      token: string;
    };


    const data = await this.jwtAuthGuard.decryptData(token);
    if (!data) {
      this.logger.error("No data found in token");
      throw new ClientNotFoundException("No data found in token");
    }

    const { clientid, email, username } = data;


    // this.logger.info("Decrypted ws application token: ", JSON.stringify(data));
    const client_data = await this.userRepository.getUserById(clientid);

    if (!client_data) throw new ClientNotFoundException(clientid);

    client.handshake.query["clientid"] = clientid;
    client.handshake.query["email"] = email;
    client.handshake.query["username"] = username;

    await this.redisRepository.HSET(["client-data"], {
      [clientid]: JSON.stringify({
        clientid,
        email,
        name: client_data.name,
      }),
    });

    return { clientid };
  }
}
