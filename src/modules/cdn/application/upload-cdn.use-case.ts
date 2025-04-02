import { Injectable } from "@nestjs/common";
import { LoggerService } from "../../shared/providers";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { UploadCallbackDto } from "../infrastructure/routes/dto/upload-cdn.dto";
import { WsClientRepository } from "../../ws-client/domain/ws-client.repository";
import { WsBotSendFileUseCase } from "../../ws-bot/application/events/ws-bot-send-file.use-case";

@Injectable()
export class UploadCdnUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly clientDataEncrypt: ClientDataEncryptUseCase,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsBotSendFileUseCase: WsBotSendFileUseCase,
  ) {}

  async uploadCallbackUseCase(
    dto: UploadCallbackDto,
  ): Promise<{ status: boolean; error?: string }> {
    try {
      this.logger.info("Upload callback use case", JSON.stringify(dto));
      const wsClientData = await this.wsClientRepository.getClient(
        dto.clientid,
      );

      if (!wsClientData) throw new Error("Client not found");

      wsClientData.controllerid;

      this.logger.info("Upload callback use case", dto);
      this.wsBotSendFileUseCase.execute(
        wsClientData.controllerid,
        dto.fileurl,
        dto.metadata,
      );
      return { status: true };
    } catch (error) {
      this.logger.error("Error on upload callback use case", error);
      return { status: false, error: "Error on upload callback use case" };
    }
  }

  async decodeToken(token: string) {
    try {
      const tokenFormated = token.replace("Bearer ", "").replace(" ", "");
      const userData = this.clientDataEncrypt.decryptUser(tokenFormated);

      this.logger.info("Decode token", userData);

      return userData;
    } catch (error) {
      // this.logger.error("Error on decode token", error);
      return { error: "Error on decode token" };
    }
  }

  async verifyTokenFile(token: string, clientid: string) {
    this.logger.info("Verify token file", token, clientid);
    return { status: true };
  }

  async uploadFile() {
    return "upload file";
  }
}
