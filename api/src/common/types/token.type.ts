export interface TokenPayload {
  email: string;
  givenName?: string;
}

/**
 * @interface Tokens
 * @property {string} access_token
 * @property {string} refresh_token
 */
export interface Tokens {
  access_token?: string;

  refresh_token?: string;
}
