import { EMPTY, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CommandBus } from '../command/command-bus';
import { EventBus } from '../event/event-bus';
import { Saga } from './saga';

@Injectable({
  providedIn: 'root',
})
export class SagaHandlerRegistry {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {
  }

  register(saga: Saga): void {
    saga.transform(this.eventBus.events).pipe(
      mergeMap(command => {
        return from(this.commandBus.execute(command)).pipe(
          catchError(error => {
            console.error(error);
            return EMPTY;
          }),
        );
      }),
    ).subscribe();
  }
}
