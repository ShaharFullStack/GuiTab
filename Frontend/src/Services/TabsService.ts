
// Frontend\src\Services\TabsService.ts
import axios from "axios";
import { TabModel } from "../Models/TabModel";
import { socketService } from "./SocketService";
import { appConfig } from "../Utils/AppConfig";

class TabsService {

    public async searchTabs(query: string, onDataReceived: (tabs: TabModel[]) => void): Promise<void> {
        query = encodeURIComponent(query);
    
        console.log("Scrape Tabs URL:", appConfig.scrapeTabsUrl);
        console.log("Socket ID:", socketService.socketId);
    
        const response = await fetch(appConfig.scrapeTabsUrl + query + "/" + socketService.socketId);
    
        const reader = response.body?.getReader();
        if (!reader) return;
    
        const decoder = new TextDecoder();
        let received = "";
    
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
    
            received += decoder.decode(value, { stream: true });
            try {
                const newTabs: TabModel[] = JSON.parse(received);
                onDataReceived(newTabs);  // מעדכן את ה-state מהקומפוננטה
            } catch (e) {
                // התוצאה עדיין לא הושלמה - ממשיכים להאזין
            }
        }
    
        console.log("Download complete.");
    }
    

    public async getRecentTabs(): Promise<TabModel[]> {
        const response = await axios.get<TabModel[]>(`${appConfig.recentTabsUrl}`);
        return response.data;
    }
}

export const tabsService = new TabsService();