
// Frontend\src\Services\TabsService.ts
import axios from "axios";
import { TabModel } from "../Models/TabModel";
import { socketService } from "./SocketService";
import { appConfig } from "../Utils/AppConfig";

class TabsService {

    public async searchTabs(query: string): Promise<TabModel[]> {
        query = encodeURIComponent(query);

        // Log the URL and socketId
        console.log("Scrape Tabs URL:", appConfig.scrapeTabsUrl);
        console.log("Socket ID:", socketService.socketId);

        const response = await axios.get<TabModel[]>(appConfig.scrapeTabsUrl + query + "/" + socketService.socketId);
        const tabs = response.data;
        return tabs;
    }

    public async getRecentTabs(): Promise<TabModel[]> {
        const response = await axios.get<TabModel[]>(`${appConfig.recentTabsUrl}`);
        return response.data;
    }
}

export const tabsService = new TabsService();