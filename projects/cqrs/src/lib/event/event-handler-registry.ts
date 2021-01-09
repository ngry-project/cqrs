import { Injectable } from '@angular/core';
import { EventHandler } from './event-handler';
import { IEvent } from './event.interface';

@Injectable()
export class EventHandlerRegistry {
  private readonly handlers = new Set<EventHandler>();

  of(event: IEvent): ReadonlySet<EventHandler> {
    const handlers = new Set<EventHandler>();

    for (const handler of this.handlers) {
      if (event instanceof handler.handles) {
        handlers.add(handler);
      }
    }

    if (handlers.size === 0) {
      throw new Error(`No event handlers found for event of type ${event.constructor.name}`);
    }

    return handlers;
  }

  register(handler: EventHandler) {
    if (this.handlers.has(handler)) {
      throw new Error(`${handler.constructor.name} already registered`);
    }

    this.handlers.add(handler);
  }
}
