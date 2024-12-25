import cors from "cors";
import express, { Express, Request } from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer, Server as HttpServer } from "http";
import { fileSaver } from "uploaded-file-saver";
import { appConfig } from "./2-utils/app-config";
import { guitarProTabsOrgController } from "./5-controllers/guitarprotabs-org-controller";
import { tabFileController } from "./5-controllers/tab-file-controller";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { socketService } from "./4-services/socket-service";

class App {
    public server!: Express;
    public httpServer!: HttpServer;

    public start(): void {
        this.server = express();
        this.httpServer = createServer(this.server);

        // אתחול Socket.IO 
        socketService.init(this.httpServer);

        // מניעת DoS
        this.server.use(rateLimit({
            windowMs: 5000,
            limit: 1000,
            skip: (request: Request) => request.originalUrl.startsWith("/api")
        }));

        // CORS
        this.server.use(cors({ origin: ["http://localhost:3000"] }));

        // JSON Body
        this.server.use(express.json());

        // קבלת קבצים
        this.server.use(fileUpload());

        const absolutePath = path.join(__dirname, "1-assets", "temp");
        fileSaver.config(absolutePath);
        this.server.use("/api/tabs", express.static(absolutePath));

        // Controllers
        this.server.use("/api", guitarProTabsOrgController.router);
        this.server.use("/api", tabFileController.router);

        // Error Middleware
        this.server.use("*", errorMiddleware.routeNotFound);
        this.server.use(errorMiddleware.catchAll);

        this.httpServer.listen(appConfig.port, () => {
            console.log("Listening on http://localhost:" + appConfig.port);
        });
    }
}

export const app = new App();
app.start();
