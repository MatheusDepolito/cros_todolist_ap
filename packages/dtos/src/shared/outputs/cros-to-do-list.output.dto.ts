export type CrosToDoListControllerResponseDTO<T = object> = {
  data?: T | T[];
};

export type CrosToDoListSuccesResponseDTO<T = object> = {
  data?: T | T[];
};

export class CrosToDoListErrorResponseDTO {
  error?: string;
  messages: string[] = [];
  statusCode: number = 0;
};