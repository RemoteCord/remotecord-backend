import { Injectable } from "@nestjs/common";

type KeyLoggerMap = Map<string, string[]>;

@Injectable()
export class KeyLoggerRepository {
  private keyLogger = new Map() as KeyLoggerMap;

  constructor() {}

  createKeyLogger(clientid: string) {
    if (!this.keyLogger.has(clientid)) {
      return this.keyLogger.set(clientid, []);
    }
  }

  stopKeyLogger(clientid: string) {
    if (this.keyLogger.has(clientid)) {
      return this.keyLogger.delete(clientid);
    }
  }

  insertKey(clientid: string, key: string) {
    if (!this.keyLogger.has(clientid)) {
      return this.keyLogger.set(clientid, []);
    }

    this.keyLogger.get(clientid)?.push(key);
  }

  getKey(clientid: string) {
    return this.keyLogger.get(clientid);
  }
}
