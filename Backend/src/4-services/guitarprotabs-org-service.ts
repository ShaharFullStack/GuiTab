import fs from "fs";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";
import { TabModel } from "../3-models/tab-model";
import { downloadGpTab } from "./file-downloader"; // Import your downloader function
import { socketService } from "./socket-service";

class GuitarProTabsOrgService {
    private readonly tempDir = path.join(__dirname, "../1-assets/temp");
    private readonly baseUrl = "https://guitarprotabs.org";

    public constructor() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    private async setupUserAgent(page: Page) {
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
    }

    public async searchTabs(query: string, socketId: string): Promise<TabModel[]> {
        let browser: Browser | null = null;  // הגדרה נכונה של browser
        const tabs: TabModel[] = [];

        try {
            socketService.sendMessage(`Starting search for "${query}"...`, socketId);

            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await this.setupUserAgent(page);

            socketService.sendMessage("Navigating to main page...", socketId);
            await page.goto(this.baseUrl, { waitUntil: "networkidle2" });

            socketService.sendMessage("Opening search box...", socketId);
            await page.click("a.toggle-search");
            await page.waitForSelector("input.form-control.input-search");

            socketService.sendMessage(`Typing query "${query}"...`, socketId);
            await page.type("input.form-control.input-search", query, { delay: 100 });

            socketService.sendMessage("Submitting search...", socketId);
            await page.click("button.btn[type='submit']");

            socketService.sendMessage("Waiting for results...", socketId);
            await page.waitForSelector("table.table-striped", { timeout: 60000 });

            socketService.sendMessage("Extracting results...", socketId);
            const results = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll("table.table-striped tbody tr"));
                return rows.map(row => {
                    const songName = row.querySelector("td.ucwords a")?.textContent?.trim() || "";
                    const bandName = row.querySelector("td:nth-child(2) a")?.textContent?.trim() || "";
                    const fileType = row.querySelector("td:nth-child(3)")?.textContent?.trim() || "";
                    const downloadUrl = row.querySelector("td.ucwords a")?.getAttribute("href") || "";
                    return { songName, bandName, fileType, downloadUrl };
                });
            });

            for (const result of results) {
                if (!result.downloadUrl) continue;

                socketService.sendMessage(`Opening detail page for "${result.songName}"...`, socketId);
                const detailPage = await browser.newPage();
                await this.setupUserAgent(detailPage);

                const detailUrl = result.downloadUrl;
                console.log("Opening detail page:", detailUrl);
                await detailPage.goto(detailUrl, { waitUntil: "networkidle2" });

                socketService.sendMessage("Extracting final download URL...", socketId);
                await detailPage.waitForSelector("a.btn.btn-info", { timeout: 60000 });

                const finalDownloadUrl = await detailPage.evaluate(() => {
                    const link = document.querySelector("a.btn.btn-info") as HTMLAnchorElement;
                    return link ? link.href : "";
                });

                const tab = new TabModel();
                tab.website = "guitarprotabs.org";
                tab.songName = result.songName;
                tab.bandName = result.bandName;
                tab.fileType = result.fileType;

                if (finalDownloadUrl) {
                    socketService.sendMessage(`Downloading file for "${tab.songName}"...`, socketId);

                    try {
                        const cookie = "PHPSESSID=kuvp6aat7hoelthnuk8ahh9cs7";
                        const fileName = await downloadGpTab(finalDownloadUrl, detailUrl, cookie);

                        tab.downloadUrl = `http://localhost:4000/api/tab-file/${fileName}`;
                    } catch (downloadErr: any) {
                        console.error("Error downloading file:", downloadErr);
                        socketService.sendMessage(`Error downloading "${tab.songName}": ${downloadErr.message}`, socketId);
                        await detailPage.close();
                        continue;
                    }
                }

                await detailPage.close();
                tabs.push(tab);
            }

            socketService.sendMessage(`Found ${tabs.length} results for "${query}"`, socketId);
            return tabs;

        } catch (err) {
            console.error("Error searching tabs:", err);
            throw err;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

export const guitarProTabsOrgService = new GuitarProTabsOrgService();
