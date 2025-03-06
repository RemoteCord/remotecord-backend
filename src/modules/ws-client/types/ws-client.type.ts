import { Socket } from "socket.io";
import { UserModel } from "src/repository/user/user.schema";

export type ClientSockets = {
  socket: Socket;
  controllerid: string;
  client_data: UserModel;
};
export type ClientsMap = Map<string, ClientSockets>;

