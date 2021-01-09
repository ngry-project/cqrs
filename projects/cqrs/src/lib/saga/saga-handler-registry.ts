import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CommandBus } from '../command/command-bus';
import { ErrorBus } from '../error/error-bus';
import { EventBus } from '../event/event-bus';
import { Saga } from './saga';

@Injectable()
export class SagaHandlerRegistry {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly errorBus: ErrorBus,
  ) {
  }

  register(saga: Saga): void {
    saga.transform(this.eventBus.events).pipe(
      mergeMap(async command => {
        try {
          await this.commandBus.execute(command);
        } catch (error) {
          await this.errorBus.catch(error);
        }
      }),
    ).subscribe();
  }
}
