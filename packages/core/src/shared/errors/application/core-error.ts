import { CoreErrorCode } from './core-error-code.enum';

export class CoreError {
  message: string;
  coreErrorCode: CoreErrorCode;

  constructor(message: string, coreErrorCode: CoreErrorCode) {
    this.message = message;
    this.coreErrorCode = coreErrorCode;
  }
}
