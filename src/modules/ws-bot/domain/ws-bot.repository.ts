import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { FileRequest } from "../../ws-client/types/tasks.type";

@Injectable()
export class WsBotRepository {
  socket: Socket | undefined;

  constructor() {}

  async generateClient(client: Socket) {
    this.socket = client;
  }

  async removeClient() {
    this.socket = undefined;
  }
}
