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
import { JwtAuthGuard } from "../../auth/infrastructure/jwt.guard";

@Injectable()
export class WsApplicationGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) { } // @InjectModel(UserModel.name) private userModel: Model<UserModel>,

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // console.log('context:', context);

      const client: Socket = context.switchToWs().getClient();
      // console.log('client:', client);

      if (!client) throw new UnauthorizedException();

      const { token } = client.handshake.auth;
      // console.log("token:", token);
      if (!token) throw new UnauthorizedException();

      const { clientid } =
        await this.jwtAuthGuard.decryptData(token);

      //   const id = this.verifyToken(token);
      //   client["clientid"] = id;

      client.handshake.query["clientid"] = clientid;

      this.logger.debug(`Passed WsApplicationGuard ${clientid}`);

      return true;
    } catch (error) {
      // this.logger.error("Error:", error);
      throw new UnauthorizedException();
    }
  }
}
