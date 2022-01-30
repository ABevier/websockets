import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    console.log("New user joining room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);

    // If the current socket is  a member of another room  OR
    // If there are 2 connected sockets already in the room
    if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size == 2)) {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play",
      });
    } else {
      // add the user to the room
      await socket.join(message.roomId);
      socket.emit("room_joined");
    }
  }
}
