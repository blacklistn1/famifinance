export interface TokenPayload {
  email: string;
  givenName?: string;
}

/**
 * @interface Tokens
 * @property {string} [access_token]  - Access token
 * @property {string} [refresh_token] - Refresh Token
 */
export interface Tokens {
  access_token?: string;

  refresh_token?: string;
}
