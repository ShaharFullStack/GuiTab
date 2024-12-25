import axios from "axios";
import fs from "fs";
import path from "path";

export async function downloadGpTab(fileUrl: string, referer: string, cookie: string, res?: any): Promise<string> {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": referer,
        "Cookie": cookie,
        "Upgrade-Insecure-Requests": "1"
    };

    const response = await axios.get<ArrayBuffer>(fileUrl, {
        responseType: "arraybuffer",
        headers
    });

    if (response.status !== 200) {
        throw new Error("Failed to download the file. Status: " + response.status);
    }

    const contentDisposition = response.headers["content-disposition"];
    let fileName = "file.gp3";
    if (contentDisposition && contentDisposition.includes("filename=")) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match && match[1]) {
            fileName = match[1];
        }
    }

    const uint8Array = new Uint8Array(response.data);
    const savePath = path.join(__dirname, "../1-assets/temp", fileName);
    fs.writeFileSync(savePath, uint8Array);

    console.log(`Downloaded and saved: ${fileName}`);

    // שליחת הקובץ ל-Frontend מיד לאחר שמירתו
    if (res) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(uint8Array);  // שליחה ישירה של הקובץ
        console.log(`Sent to frontend: ${fileName}`);
    }

    return fileName;
}
