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

  async publish(event: IEvent): Promise<void> {
    const handlers = this.registry.of(event);

    if (handlers.size > 0) {
      await Promise.all([...handlers].map(handler => handler.handle(event)));
    }

    this._events.next(event);
  }
}
