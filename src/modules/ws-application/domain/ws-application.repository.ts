import { Injectable } from "@nestjs/common";
import {
  WsApplicationsMap,
  ApplicationSockets,
  FriendRequestsMap,
  FriendRequestValue,
} from "../types/ws-application.type";
import { Socket } from "socket.io";
import { generateRandomHex } from "@/src/utils";

@Injectable()
export class WsApplicationRepository {
  clients = new Map() as WsApplicationsMap;
  friendsRequests = new Map() as FriendRequestsMap;

  connections = new Map<string, string>();

  constructor() {}

  addClient(clientid: string, data: ApplicationSockets) {
    this.clients.set(clientid, data);
  }

  removeClient(clientid: string) {
    this.clients.delete(clientid);
  }
  getClient(clientid: string) {
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

  addRequest(clientid: string, data: FriendRequestValue) {
    this.friendsRequests.set(clientid, data);
  }

  removeRequest(clientid: string) {
    this.friendsRequests.delete(clientid);
  }

  getRequest(clientid: string) {
    return this.friendsRequests.get(clientid);
  }

  generateConnectionToken(clientid: string) {
    const token = generateRandomHex();
    this.connections.set(clientid, token);
    console.log(this.connections);
    return token;
  }

  getConnectionToken(clientid: string) {
    return this.connections.get(clientid);
  }
  removeConnectionToken(clientid: string) {
    this.connections.delete(clientid);
  }
}
