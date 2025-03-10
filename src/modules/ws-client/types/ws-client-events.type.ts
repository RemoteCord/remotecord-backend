import { DirEntry, Process } from "./tasks.type";

export type RunCmdCommandEvent = {
  command: string;
};

export interface GetExplorerFromClientEvent {
  files: DirEntry[];
  folder: string;
  relativepath: string;
}

export interface TasksEvent {
  tasks: Process[];
}

export interface GetScreensFromClientEvent {
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
