import { Injectable } from "@nestjs/common";
import { ClientsMap, ClientSockets } from "../types/ws-client.type";
import { Socket } from "socket.io";

@Injectable()
export class WsClientRepository {
  clients = new Map() as ClientsMap;
  constructor() {}

  async addClient(clientid: string, data: ClientSockets) {
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
