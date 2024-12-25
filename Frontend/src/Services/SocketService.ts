import { Socket, io } from "socket.io-client";

class SocketService {
    private socket: Socket;
    private currentSocketId: string | null = null;

    public get socketId(): string | null {
        return this.currentSocketId;
    }

    public connect(callback: (message: string) => void): void {
        this.socket = io("http://localhost:4000");

        this.socket.on("connect", () => {
            console.log("Connected to socket server, socketId:", this.socket.id);
            this.currentSocketId = this.socket.id;  // עדכון ה-socketId לאחר התחברות
        });

        this.socket.on("my-id", (id: string) => {
            console.log("Received socket ID from server:", id);
            this.currentSocketId = id;  // שמירה על ה-socketId שהתקבל מהשרת
        });

        this.socket.on("message", (message: string) => {
            callback(message);
        });

        this.socket.on("disconnect", () => {
            console.log("Socket disconnected");
            this.currentSocketId = null;  // איפוס ה-socketId לאחר ניתוק
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            console.log("Socket disconnected manually");
        }
    }
}

export const socketService = new SocketService();
