import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      this.socket.on("connect", () => {
        // TODO: this is jank
        resolve(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.error(`Connection Error: `, err);
        reject(err);
      });
    });
  }
}

export default new SocketService();
