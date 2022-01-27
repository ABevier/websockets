import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    console.log("New user joining room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
  }
}
