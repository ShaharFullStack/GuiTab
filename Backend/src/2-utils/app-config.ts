// File: src/2-utils/app-config.ts

import dotenv from "dotenv";

// Load the ".env" file to populate process.env variables
dotenv.config();

class AppConfig {

    // Indicates if the environment is development
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";

    // Indicates if the environment is production
    public readonly isProduction = process.env.ENVIRONMENT === "production";

    // The port number for the application to listen on
    public readonly port = +(process.env.PORT || 4000);

    // MySQL host address
    public readonly host = process.env.MYSQL_HOST;

    // MySQL username
    public readonly user = process.env.MYSQL_USER;

    // Base URL for the application
    public readonly baseUrl = process.env.BASE_URL;

    // MySQL password
    public readonly password = process.env.MYSQL_PASSWORD;

    // MySQL database name
    public readonly database = process.env.MYSQL_DATABASE;

    // File download directory
    public readonly fileDownload = process.env.FILE_DOWNLOAD;

}

// Export a single instance of the configuration
export const appConfig = new AppConfig();
