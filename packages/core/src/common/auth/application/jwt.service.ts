type JwtSignOptions = {};
type JwtVerifyOptions = {};
type JwtDecodeOptions = {};

export interface IJwtService {
  sign(payload: string, options?: JwtSignOptions): string;
  sign(payload: Buffer | object, options?: JwtSignOptions): string;
  verify<T>(token: string, options?: JwtVerifyOptions): T;
  decode<T>(token: string, options?: JwtDecodeOptions): T;
}
