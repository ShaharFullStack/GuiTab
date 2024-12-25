// File: src/6-middleware/error-middleware.ts

import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { appConfig } from "../2-utils/app-config";
import { NotFoundError } from "../3-models/error-models";

class ErrorMiddleware {

    /**
     * Handles all errors thrown during request handling.
     * @param err - The error object.
     * @param request - Express request object.
     * @param response - Express response object.
     * @param next - Express next middleware function.
     */
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

        // Log the error for debugging
        console.error(err);

        // Determine the status code; default to 500 if not specified
        const status = err.status || StatusCode.InternalServerError;

        // Determine the error message
        const isCrash = status >= 500 && status <= 599;
        const message = isCrash && appConfig.isProduction
            ? "Some error occurred, please try again."
            : err.message;

        // Send the error response
        response.status(status).send(message);
    }

    /**
     * Middleware to handle requests to non-existing routes.
     * @param request - Express request object.
     * @param response - Express response object.
     * @param next - Express next middleware function.
     */
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        next(new NotFoundError(`Route ${request.originalUrl} not found.`));
    }
}

// Export a single instance of the ErrorMiddleware
export const errorMiddleware = new ErrorMiddleware();