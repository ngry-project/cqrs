import { Observable } from 'rxjs';
import { ICommand } from '../command/command.interface';
import { IEvent } from '../event/event.interface';

export interface Saga {
  transform(events: Observable<IEvent>): Observable<ICommand>;
}
