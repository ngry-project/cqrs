import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CqrsModule } from '../cqrs.module';
import { EventBus } from './event-bus';
import { EventHandler } from './event-handler';

class ExampleEvent {
  constructor(
    readonly data: string,
  ) {
  }
}

@Injectable()
class ExampleEventHandler1 implements EventHandler<ExampleEvent> {
  readonly handles = ExampleEvent;

  handle(event: ExampleEvent): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class ExampleEventHandler2 implements EventHandler<ExampleEvent> {
  readonly handles = ExampleEvent;

  handle(event: ExampleEvent): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('EventBus', () => {
  let eventBus: EventBus;
  let handler1: ExampleEventHandler1;
  let handler2: ExampleEventHandler2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CqrsModule.forRoot(),
        CqrsModule.forFeature({
          events: [
            ExampleEventHandler1,
            ExampleEventHandler2,
          ],
        }),
      ],
    }).compileComponents();

    eventBus = TestBed.inject(EventBus);
    handler1 = TestBed.inject(ExampleEventHandler1);
    handler2 = TestBed.inject(ExampleEventHandler2);

    expect(eventBus).toBeInstanceOf(EventBus);
    expect(handler1).toBeInstanceOf(ExampleEventHandler1);
    expect(handler2).toBeInstanceOf(ExampleEventHandler2);
  });

  describe('publish', () => {
    it('should handle events using corresponding event handlers', async () => {
      const handleMethod1 = spyOn(handler1, 'handle').and.callThrough();
      const handleMethod2 = spyOn(handler2, 'handle').and.callThrough();

      await eventBus.publish(new ExampleEvent('One'));

      expect(handleMethod1).toHaveBeenCalledTimes(1);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('One'));
      expect(handleMethod2).toHaveBeenCalledTimes(1);
      expect(handleMethod2).toHaveBeenLastCalledWith(new ExampleEvent('One'));


      await eventBus.publish(new ExampleEvent('Two'));

      expect(handleMethod1).toHaveBeenCalledTimes(2);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('Two'));
      expect(handleMethod2).toHaveBeenCalledTimes(2);
      expect(handleMethod2).toHaveBeenLastCalledWith(new ExampleEvent('Two'));


      await eventBus.publish(new ExampleEvent('Three'));

      expect(handleMethod1).toHaveBeenCalledTimes(3);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('Three'));
      expect(handleMethod2).toHaveBeenCalledTimes(3);
      expect(handleMethod2).toHaveBeenLastCalledWith(new ExampleEvent('Three'));
    });
  });
});
