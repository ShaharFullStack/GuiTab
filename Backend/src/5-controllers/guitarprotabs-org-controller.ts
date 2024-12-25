// File: src/5-controllers/guitarprotabs-org-controller.ts

import express, { NextFunction, Request, Response } from "express";
import { guitarProTabsOrgService } from "../4-services/guitarprotabs-org-service";

class GuitarProTabsOrgController {

    // Express router instance for this controller
    public readonly router = express.Router();

    public constructor() {
        // Define route for searching tabs with query and socketId
        this.router.get("/tabs/guitarprotabs-org/:query/:socketId", this.getTabs.bind(this));
    }

    /**
     * Handles requests to search guitar tabs.
     * @param request - Express request object.
     * @param response - Express response object.
     * @param next - Express next middleware function.
     */
    private async getTabs(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const query = decodeURIComponent(request.params.query); // Decode the search query
            const socketId = request.params.socketId; // Extract socket ID from parameters

            if (!query || !socketId) {
                response.status(400).json({ error: "Invalid query or socketId." });
                return;
            }

            // Perform search using the service
            const tabs = await guitarProTabsOrgService.searchTabs(query, socketId);

            if (!tabs || tabs.length === 0) {
                response.status(404).json({ error: "No tabs found for the query." });
                return;
            }

            response.json(tabs);
        } catch (err: any) {
            console.error("Error in getTabs:", err);
            next(err); // Pass the error to the error middleware
        }
    }
}

// Export a single instance of the controller
export const guitarProTabsOrgController = new GuitarProTabsOrgController();
