import { AuthType } from '../enums/auth-type.enum';

export type AuthLoginInputDTO = {
  type: AuthType;
  password: string;
  email?: string;
  username?: string;
};