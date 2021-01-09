import { Type } from '@angular/core';

export interface ErrorHandler<TError extends Error = Error> {
  readonly handles: Type<TError>;

  handle(error: TError): Promise<void>;
}
