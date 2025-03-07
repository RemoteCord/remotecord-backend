import { Socket } from "socket.io";
import { UserModel } from "src/repository/user/user.schema";

export type ApplicationSockets = {
  socket: Socket;
  client_data: UserModel;
};
export type WsApplicationsMap = Map<string, ApplicationSockets>;
