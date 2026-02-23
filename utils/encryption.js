/**
 * AES encryption/decryption using crypto-js.
 * Use for encrypting sensitive values before storing (e.g. in .env as GEMINI_API_KEY_ENCRYPTED).
 * Secret should be set via ENCRYPTION_SECRET in .env and kept private.
 */
const CryptoJS = require('crypto-js');

/**
 * Encrypt a plain string. Returns base64 ciphertext.
 * @param {string} plainText - Value to encrypt
 * @param {string} secret - Passphrase (e.g. from ENCRYPTION_SECRET)
 * @returns {string} Base64-encoded ciphertext
 */
function encrypt(plainText, secret) {
  if (!plainText || typeof plainText !== 'string') return '';
  if (!secret || typeof secret !== 'string') {
    console.warn('[encryption] No secret provided');
    return '';
  }
  try {
    const encrypted = CryptoJS.AES.encrypt(plainText.trim(), secret.trim()).toString();
    return encrypted;
  } catch (e) {
    console.error('[encryption] Encrypt failed:', e?.message);
    return '';
  }
}

/**
 * Decrypt a ciphertext string (from encrypt()).
 * @param {string} cipherText - Base64 ciphertext
 * @param {string} secret - Same passphrase used to encrypt
 * @returns {string} Plain text or empty string on failure
 */
function decrypt(cipherText, secret) {
  if (!cipherText || typeof cipherText !== 'string') return '';
  if (!secret || typeof secret !== 'string') {
    console.warn('[encryption] No secret provided');
    return '';
  }
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText.trim(), secret.trim());
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    return plain || '';
  } catch (e) {
    console.error('[encryption] Decrypt failed:', e?.message);
    return '';
  }
}

module.exports = { encrypt, decrypt };
