import { Injectable } from '@angular/core';
import { ErrorHandlerRegistry } from './error-handler-registry';

@Injectable()
export class ErrorBus {
  constructor(
    private readonly registry: ErrorHandlerRegistry,
  ) {
  }

  async catch(error: Error): Promise<void> {
    await this.registry.of(error).handle(error);
  }
}
