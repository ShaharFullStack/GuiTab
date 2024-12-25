// Frontend\src\Utils\AppConfig.ts

class AppConfig {
    public readonly baseUrl = process.env.REACT_APP_BASE_URL;
    public readonly scrapeTabsUrl = this.baseUrl + "api/tabs/guitarprotabs-org/";
    public readonly tabFileUrl = this.baseUrl + "api/tabs/tab-file/";
    public readonly recentTabsUrl = this.baseUrl + "api/tabs/recent";
}

export const appConfig = new AppConfig();
