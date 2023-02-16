export interface JwtPayload {
  id: number;

  email: string;
}

export interface Tokens {
  accessToken?: string;

  refreshToken?: string;
}
