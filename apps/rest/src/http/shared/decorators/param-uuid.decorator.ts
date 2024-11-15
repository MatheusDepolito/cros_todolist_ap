import { isUUID } from 'class-validator';
import { ExecutionContext, BadRequestException, createParamDecorator } from '@nestjs/common';

export const ParamUUID = createParamDecorator((property: string, ctx: ExecutionContext) => {
  const value = ctx.switchToHttp().getRequest().params[property];
  if (!isUUID(value, 4)) {
    throw new BadRequestException(`param: ${property}, validation failed (uuid v 4 is expected)`);
  }
  return value;
});
