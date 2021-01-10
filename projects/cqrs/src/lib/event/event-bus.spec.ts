import { take } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { CqrsModule } from '../cqrs.module';
import { EventBus } from './event-bus';
import { IEvent } from './event.interface';

class ExampleEvent {
  constructor(
    readonly data: string,
  ) {
  }
}

describe('EventBus', () => {
  describe('publish', () => {
    it('should emit the event through the events subject', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forRoot(),
        ],
      }).compileComponents();

      const eventBus = TestBed.inject(EventBus);
      const events: Array<IEvent> = [];

      eventBus.events.subscribe(event => events.push(event));

      eventBus.publish(new ExampleEvent('One'));
      eventBus.publish(new ExampleEvent('Two'));
      eventBus.publish(new ExampleEvent('Three'));

      expect(events).toEqual([
        new ExampleEvent('One'),
        new ExampleEvent('Two'),
        new ExampleEvent('Three'),
      ]);
    });
  });
});
