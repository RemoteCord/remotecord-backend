import { Socket } from "socket.io";
import { UserModel } from "src/repository/user/user.schema";
import { FileRequest } from "./tasks.type";

export type ClientSockets = {
  socket: Socket;
  controllerid: string;
  client_data: UserModel;
};
export type ClientsMap = Map<string, ClientSockets>;

export type ClientUploadFile = Map<string, FileRequest>;
