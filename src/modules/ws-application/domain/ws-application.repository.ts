import { Injectable } from "@nestjs/common";
import {
  WsApplicationsMap,
  ApplicationSockets,
} from "../types/ws-application.type";
import { Socket } from "socket.io";

@Injectable()
export class WsApplicationRepository {
  clients = new Map() as WsApplicationsMap;
  constructor() {}

  async addClient(clientid: string, data: ApplicationSockets) {
    this.clients.set(clientid, data);
  }

  async removeClient(clientid: string) {
    this.clients.delete(clientid);
  }
  async getClient(clientid: string) {
    return this.clients.get(clientid);
  }

  async removeAllClients() {
    await Promise.all(
      Array.from(this.clients.values()).map(async client => {
        client.socket.disconnect();
      }),
    );

    this.clients.clear();
  }
}
