import { Injectable } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { JwtAuthGuard } from "../../auth/infrastructure/jwt.guard";

@Injectable()
export class WsApplicationVerifyConnectionUseCase {
  constructor(
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {}

  async execute(token: string) {
    if (!token) throw new Error("Token not provided");
    // console.log("Token", token);
    // const data = this.clientDataEncryptUseCase.decryptUser(token);
    const data = await this.jwtAuthGuard.decryptData(token);

    // console.log("data:", data);
    if (!data) {
      throw new Error("Invalid token");
    }

    return data;
  }
}
