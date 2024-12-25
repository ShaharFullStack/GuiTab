// File: src/3-models/enums.ts

/**
 * Enumeration of HTTP status codes for standard responses.
 */
export enum StatusCode {
    OK = 200, // Request succeeded
    Created = 201, // Resource created successfully
    NoContent = 204, // Request succeeded with no content
    BadRequest = 400, // Client sent an invalid request
    Unauthorized = 401, // Authentication is required
    Forbidden = 403, // Client does not have access rights
    NotFound = 404, // Requested resource not found
    InternalServerError = 500 // Server encountered an error
}
