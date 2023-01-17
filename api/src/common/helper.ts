import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
/**
 * Encrypt password using scrypt
 * @param {string} password
 * @param {string} salt
 * @param {number} keylen
 * @return {Promise<Buffer | Error>}
 */
export async function encryptPassword(
  password: string,
  salt: string,
  keylen: number,
): Promise<Buffer | Error> {
  return (await scrypt(password, salt, keylen)) as Buffer;
}

/**
 * Generate a new salt for hashing data
 * @param {number} length
 */
export function generateSalt(length: number) {
  return randomBytes(length).toString('hex');
}
