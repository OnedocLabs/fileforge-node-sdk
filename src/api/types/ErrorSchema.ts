/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Generic error response schema
 */
export interface ErrorSchema {
    /** The HTTP status code */
    statusCode: number;
    /** A machine-readable error code */
    code: string;
    /** A human-readable message */
    message: string;
}
