/* eslint-disable prettier/prettier */
import * as crypto from 'crypto';

export function verifyPayMongoSignature(
    rawBody: string,
    signature: string,
    secret: string,
): boolean {
    if (!signature) return false;

    const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    return signature.includes(expected);
}