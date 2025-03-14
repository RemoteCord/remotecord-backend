import { Configuration } from "@/src/config/env.enum";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JWTPayload } from "jose";
import { LoggerService } from "../../shared/providers";

@Injectable()
export class ClientDataEncryptUseCase {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  decryptUser(token: string) {
    const secret = this.configService.get<string>(Configuration.SECRET);
    if (!secret) throw new Error("Decryption secret not configured");

    const decrypted = this.jwtService
      .decode(token)
      .replace(/\s/g, "")
      .split(",");
    this.logger.info("Decrypted User:", decrypted, token);
    if (!decrypted) throw new Error("Failed to decrypt data");

    const [clientid, email, username]: string[] = decrypted;

    // console.log("Decrypted:", clientid, email, username);
    if (!clientid || !email || !username) throw new Error("Invalid token data");
    return {
      clientid,
      email,
      username,
    };
  }

  encrypt(data: string): string {
    try {
      const secret = this.configService.get<string>(Configuration.SECRET);
      if (!secret) throw new Error("Encryption secret not configured");

      const signResult = this.jwtService.sign(data);
      this.logger.info(`Encrypted token from ${data}: ${signResult}`);
      return signResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Encryption error:", errorMessage);
      throw new Error("Failed to encrypt data");
    }
  }

  decrypt(text: string): string {
    try {
      const secret = this.configService.get<string>(Configuration.SECRET);
      if (!secret) throw new Error("Decryption secret not configured");

      const decrypted = this.jwtService.decode(text);
      this.logger.info("Decrypted:", decrypted);
      if (!decrypted) throw new Error("Failed to decrypt data");

      return decrypted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error("Decryption error:", errorMessage);
      throw new Error("Failed to decrypt data");
    }
  }
}
