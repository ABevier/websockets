import { Socket } from "socket.io-client";
import { GameBoard } from "../components/game";

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => resolve(true));
      socket.on("room_join_error", ({ error }) => reject(error));
    });
  }

  public async updateGame(socket: Socket, gameBoard: GameBoard) {
    socket.emit("update_game", { gameBoard });
  }

  public async onGameUpdate(socket: Socket, listener: (board: GameBoard) => void) {
    socket.on("on_game_update", ({ gameBoard }) => listener(gameBoard));
  }
}

export default new GameService();
