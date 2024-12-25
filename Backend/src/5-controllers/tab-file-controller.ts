import express, { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";

class TabFileController {
    public readonly router = express.Router();
    private readonly tempDir = path.join(__dirname, "../1-assets/temp");

    public constructor() {
        // נתיב להורדת קובץ לפי שם
        this.router.get("/tab-file/:fileName", this.getFile.bind(this));
        
        // נתיב לשליפת רשימת הקבצים האחרונים
        this.router.get("/tabs/recent", this.getRecentTabs.bind(this));
    }

    /**
     * שליפת קובץ לפי שם והורדתו
     */
    private getFile(request: Request, response: Response, next: NextFunction) {
        try {
            const fileName = request.params.fileName;
            const filePath = path.join(this.tempDir, fileName);

            if (!fs.existsSync(filePath)) {
                response.status(404).send("File not found");
                return;
            }

            response.sendFile(filePath);
            
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * שליפת רשימת קבצים אחרונים שנשמרו בתיקיית temp
     */
    private getRecentTabs(request: Request, response: Response, next: NextFunction) {
        try {
            // קריאה לתיקיית temp ושליפת הקבצים
            const files = fs.readdirSync(this.tempDir);
            
            // בניית אובייקט JSON שמכיל נתונים על כל קובץ
            const tabs = files.map(file => ({
                songName: file.replace(/_/g, ' ').split('.').slice(0, -1).join('.'),
                fileType: file.split('.').pop(),
                downloadUrl: `http://localhost:4000/api/tab-file/${file}`
            }));

            response.json(tabs);
        } catch (err) {
            next(err);
        }
    }
}

export const tabFileController = new TabFileController();
