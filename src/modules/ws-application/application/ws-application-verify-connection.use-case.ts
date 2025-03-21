import { Injectable } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";

@Injectable()
export class WsApplicationVerifyConnectionUseCase {
  constructor(
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  async execute(token: string) {
    if (!token) throw new Error("Token not provided");

    const data = this.clientDataEncryptUseCase.decryptUser(token);

    console.log("data:", data);
    if (!data) {
      throw new Error("Invalid token");
    }

    return data;
  }
}
