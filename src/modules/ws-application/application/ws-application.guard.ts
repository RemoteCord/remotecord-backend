import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
// import { jwtConstants } from 'src/shared/constants';
// import * as CryptoJS from 'crypto-js';
import { Socket } from "socket.io";
import { LoggerService } from "../../shared/providers";
import { WsApplicationVerifyConnectionUseCase } from "./ws-application-verify-connection.use-case";

@Injectable()
export class WsApplicationGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsApplicationVerifyConnectionUseCase: WsApplicationVerifyConnectionUseCase,
  ) {} // @InjectModel(UserModel.name) private userModel: Model<UserModel>,

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // console.log('context:', context);

      const client: Socket = context.switchToWs().getClient();
      // console.log('client:', client);

      if (!client) throw new UnauthorizedException();

      const { token } = client.handshake.auth;
      console.log("token:", token);
      if (!token) throw new UnauthorizedException();

      const clientid =
        await this.wsApplicationVerifyConnectionUseCase.execute(token);

      //   const id = this.verifyToken(token);
      //   client["clientid"] = id;

      client.handshake.query["clientid"] = clientid;

      this.logger.info("passed ws event client guard");

      return true;
    } catch (error) {
      this.logger.error("Error:", error);
      throw new UnauthorizedException();
    }
  }
}
