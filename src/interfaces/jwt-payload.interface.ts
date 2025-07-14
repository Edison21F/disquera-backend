export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}