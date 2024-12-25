import { Server as HttpServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";

class SocketService {
    private socketServer: SocketServer | null = null;

    public init(httpServer: HttpServer): void {
        const options = { cors: { origin: "*" } };
        this.socketServer = new SocketServer(httpServer, options);

        this.socketServer.sockets.on("connection", (socket: Socket) => {
            console.log("New client has been connected. Socket id:", socket.id);
            socket.emit("my-id", socket.id);

            socket.on("disconnect", () => {
                console.log("Client has been disconnected.");
            });
        });
    }

    public sendMessage(message: string, socketId: string): void {
        if (!this.socketServer) {
            console.error("Socket server is not initialized.");
            return;
        }

        const socket = this.socketServer.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit("message", message);
        } else {
            console.warn(`Socket with id ${socketId} not found.`);
        }
    }
}

export const socketService = new SocketService();
