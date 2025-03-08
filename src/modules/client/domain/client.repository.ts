import { Injectable } from "@nestjs/common";
import { FileRequest } from "../../ws-client/types/tasks.type";

@Injectable()
export class ClientRepository {
  files = new Map();

  filesToken = new Map() as Map<string, string>;

  constructor() {}

  async addFile(controllerid: string, data: FileRequest) {
    if (this.files.has(controllerid)) {
      this.files.delete(controllerid);
    }
    console.log(controllerid, data);
    this.files.set(controllerid, data);
  }

  getFile(controllerid: string) {
    // console.log(this.files);
    const file = this.files.get(controllerid) as FileRequest;

    if (!file) {
      throw new Error("File not found");
    }

    this.filesToken.delete(controllerid);

    return file;
  }

  async deleteFile(controllerid: string) {
    this.files.delete(controllerid);
  }

  addTokenForFile(clientid: string, token: string) {
    this.filesToken.set(clientid, token);
  }

  getTokenForFile(clientid: string) {
    const token = this.filesToken.get(clientid);
    console.log(token);
    return token;
  }
}
