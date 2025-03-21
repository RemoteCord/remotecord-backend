import { Socket } from "socket.io";
import { UserModel } from "@/src/repository/db/user/user.schema";

export type ApplicationSockets = {
  socket: Socket;
  client_data: UserModel;
};
export type WsApplicationsMap = Map<string, ApplicationSockets>;

export type FriendRequestsMap = Map<string, FriendRequestValue>;

export type FriendRequestValue = {
  token: string;
  controllerid: string;
};
