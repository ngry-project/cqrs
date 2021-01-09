import { Injectable } from '@angular/core';
import { ErrorHandler } from './error-handler';

@Injectable()
export class ErrorHandlerRegistry {
  private readonly handlers = new Set<ErrorHandler>();

  of(error: Error): ErrorHandler | never {
    for (const handler of this.handlers) {
      if (error instanceof handler.handles) {
        return handler;
      }
    }

    throw new Error(`No error handler found for error of type ${error.constructor.name}`);
  }

  register(handler: ErrorHandler): void {
    if (this.handlers.has(handler)) {
      throw new Error(`${handler.constructor.name} already registered`);
    }

    this.handlers.add(handler);
  }
}
