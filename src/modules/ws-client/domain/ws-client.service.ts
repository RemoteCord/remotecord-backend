import { Injectable } from "@nestjs/common";
import { ClientsMap } from "../types/ws-client.type";

@Injectable()
export class WsClientService {
  clients = new Map() as ClientsMap;
  constructor() {}
}
