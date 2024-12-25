// File: src/3-models/error-model.ts

import { StatusCode } from "./enums";

/**
 * Abstract class representing a client error.
 */
abstract class ClientError {
    /**
     * @param status - The HTTP status code representing the error.
     * @param message - The error message to be returned to the client.
     */
    protected constructor(public status: StatusCode, public message: string) {}
}

/**
 * Represents a 400 Bad Request error.
 */
export class BadRequestError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }
}

/**
 * Represents a 401 Unauthorized error.
 */
export class UnauthorizedError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Unauthorized, message);
    }
}

/**
 * Represents a 403 Forbidden error.
 */
export class ForbiddenError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.Forbidden, message);
    }
}

/**
 * Represents a 404 Not Found error.
 */
export class NotFoundError extends ClientError {
    public constructor(message: string) {
        super(StatusCode.NotFound, message);
    }
}
