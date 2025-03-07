import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { ClientUploadFile } from "./ws-events.type";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";

@Injectable()
export class WsClientUploadFile {
  constructor(private readonly wsClientRepository: WsClientRepository) {}

  async execute({ clientid, fileroute }: ClientUploadFile) {
    const client = await this.wsClientRepository.getClient(clientid);

    if (!client) {
      throw new ClientNotFoundException(clientid);
    }

    const { socket } = client;

    socket.emit("uploadFile", {
      fileroute,
    });
  }
}
