/**
 * @interface UserInfo
 * @property {string | null} [id] - Social id
 */
export interface UserInfo {
  email?: string | null;

  family_name?: string | null;

  given_name?: string | null;

  id?: string | null;

  locale?: string | null;

  name?: string | null;

  picture?: string | null;

  verified_email?: boolean | null;
}

export interface TokenInfo {
  email?: string;

  user_id?: string;

  scopes: string[];

  access_type?: string;

  email_verified?: boolean;
}
