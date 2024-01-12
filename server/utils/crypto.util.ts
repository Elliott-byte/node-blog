import crypto from 'crypto-js';

/**
 *
 * @param value original value
 * @returns sha1 value
 */
export const sha1 = (value: string) => {
  return crypto.SHA1(value).toString(crypto.enc.Hex);
};

export const getDerivedKey = (str: string) => {
  return crypto.MD5(str).toString(crypto.enc.Hex);
};

export const decrypt = (str: string) => {
  const s1 = str.slice(0, 16);
  const s2 = str.slice(str.length - 16, str.length);
  const key = str.slice(16, str.length - 16);
  return crypto.AES.decrypt(key, s1 + s2).toString(crypto.enc.Utf8);
};
