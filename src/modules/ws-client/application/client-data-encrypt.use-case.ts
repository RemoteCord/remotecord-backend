import { Configuration } from "@/src/config/env.enum";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JWTPayload } from "jose";

@Injectable()
export class ClientDataEncryptUseCase {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  encrypt(id: string): string {
    try {
      const secret = this.configService.get<string>(Configuration.SECRET);
      if (!secret) throw new Error("Encryption secret not configured");

      const signResult = this.jwtService.sign(id);
      console.log("Encrypted:", signResult);
      return signResult;
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  decrypt(text: string): string | JWTPayload {
    try {
      const secret = this.configService.get<string>(Configuration.SECRET);
      if (!secret) throw new Error("Decryption secret not configured");

      const decrypted = this.jwtService.decode(text);
      console.log("Decrypted:", decrypted);
      if (!decrypted) throw new Error("Failed to decrypt data");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt data");
    }
  }
}
