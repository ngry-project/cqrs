import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from './event.interface';
import { EventHandlerRegistry } from './event-handler-registry';

@Injectable()
export class EventBus {
  private readonly _events = new Subject<IEvent>();

  readonly events: Observable<IEvent> = this._events.asObservable();

  constructor(
    private readonly registry: EventHandlerRegistry,
  ) {
  }

  publish(event: IEvent): void {
    this._events.next(event);

    const handlers = this.registry.of(event);

    for (const handler of handlers) {
      handler.handle(event);
    }
  }
}
