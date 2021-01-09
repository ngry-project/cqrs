import { Type } from '@angular/core';
import { IEvent } from './event.interface';

export interface EventHandler<TEvent extends IEvent = IEvent> {
  readonly handles: Type<TEvent>;

  handle(event: TEvent): Promise<void>;
}
