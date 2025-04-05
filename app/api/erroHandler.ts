import { NextApiResponse } from 'next';

/**
 * Sends a 400 Bad Request response.
 * @param res - The Next.js API response object.
 * @param message - The error message to send.
 */
export function badRequest(res: NextApiResponse, message: string = 'Bad Request') {
  res.status(400).json({ success: false, error: message });
}

/**
 * Sends a 401 Unauthorized response.
 * @param res - The Next.js API response object.
 * @param message - The error message to send.
 */
export function unauthorized(res: NextApiResponse, message: string = 'Unauthorized') {
  res.status(401).json({ success: false, error: message });
}

/**
 * Sends a 403 Forbidden response.
 * @param res - The Next.js API response object.
 * @param message - The error message to send.
 */
export function forbidden(res: NextApiResponse, message: string = 'Forbidden') {
  res.status(403).json({ success: false, error: message });
}

/**
 * Sends a 404 Not Found response.
 * @param res - The Next.js API response object.
 * @param message - The error message to send.
 */
export function notFound(res: NextApiResponse, message: string = 'Not Found') {
  res.status(404).json({ success: false, error: message });
}

/**
 * Sends a 500 Internal Server Error response.
 * @param res - The Next.js API response object.
 * @param message - The error message to send.
 */
export function internalServerError(res: NextApiResponse, message: string = 'Internal Server Error') {
  res.status(500).json({ success: false, error: message });
}

/**
 * Sends a custom error response.
 * @param res - The Next.js API response object.
 * @param statusCode - The HTTP status code to send.
 * @param message - The error message to send.
 */
export function customError(res: NextApiResponse, statusCode: number, message: string) {
  res.status(statusCode).json({ success: false, error: message });
}