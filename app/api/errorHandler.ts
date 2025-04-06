import { NextResponse } from 'next/server';

/**
 * Sends a 400 Bad Request response.
 * @param message - The error message to send.
 * @returns A NextResponse object with the error details.
 */
export function badRequest(message: string = 'Bad Request') {
  return NextResponse.json({ success: false, error: { message } }, { status: 400 });
}

/**
 * Sends a 500 Internal Server Error response.
 * @param message - The error message to send.
 * @returns A NextResponse object with the error details.
 */
export function internalServerError(message: string = 'Internal Server Error') {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

/**
 * Sends a custom error response.
 * @param statusCode - The HTTP status code to send.
 * @param message - The error message to send.
 * @returns A NextResponse object with the error details.
 */
export function customError(statusCode: number, message: string) {
  return NextResponse.json({ success: false, error: message }, { status: statusCode });
}