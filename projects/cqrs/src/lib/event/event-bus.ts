import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from './event.interface';

@Injectable()
export class EventBus {
  private readonly _events = new Subject<IEvent>();

  readonly events: Observable<IEvent> = this._events.asObservable();

  publish(event: IEvent): void {
    this._events.next(event);
  }
}
