import crypto from 'crypto-js';

/**
 *
 * @param value original value
 * @returns sha1 value
 */
export const sha1 = (value: string) => {
  return crypto.SHA1(value).toString(crypto.enc.Hex);
};
