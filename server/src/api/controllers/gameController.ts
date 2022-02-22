import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter((r) => r != socket.id);
    return socketRooms?.[0];
  }

  @OnMessage("update_game")
  public async updateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const gameRoom = this.getSocketGameRoom(socket);
    console.log("received update:", message);
    socket.to(gameRoom).emit("on_game_update", message);
  }
}
