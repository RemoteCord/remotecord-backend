import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

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
