import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { Socket } from "socket.io";
import { WsClientVerifyConnectionUseCase } from "../ws-client-verify-connection.use-case";

@Injectable()
export class WsClientGuard implements CanActivate {
  private logger = new Logger("WsClientGuard");
  constructor(
    private readonly wsClientVerifyConnectionUseCase: WsClientVerifyConnectionUseCase,
  ) { } // @InjectModel(UserModel.name) private userModel: Model<UserModel>,

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // console.log('context:', context);

      const client: Socket = context.switchToWs().getClient();
      // console.log("client:", client);


      if (!client) throw new UnauthorizedException();

      const { token } = client.handshake.auth;
      if (!token) throw new UnauthorizedException();

      const { controllerid } = client.handshake.query as {
        controllerid: string;
      };

      const { clientid } = await this.wsClientVerifyConnectionUseCase.execute(
        controllerid,
        token,
      );

      //   const id = this.verifyToken(token);
      //   client["clientid"] = id;

      client.handshake.query["clientid"] = clientid;
      client.handshake.query["controllerid"] = controllerid;


      this.logger.log("Passed WsClientGuard");

      // await this.commandsRepository.deleteCommandEvent(clientid, );




      return true;
    } catch (error) {
      this.logger.error("Error:", error);
      throw new UnauthorizedException();
    }
  }
}
