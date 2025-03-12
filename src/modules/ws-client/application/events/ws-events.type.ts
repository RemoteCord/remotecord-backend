import { FileRequest } from "../../types/tasks.type";

export interface ClientUploadFile {
  fileroute: string;
  clientid: string;
}

export interface ClientGetFile {
  fileroute: string;
  clientid: string;
}

export interface AddFileClient {
  clientid: string;
  file: FileRequest;
}

export interface AddFriend {
  controllerid: string;
}
