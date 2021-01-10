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
  describe('publish', () => {
    it('should handle the event using corresponding event handler', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forRoot(),
          CqrsModule.forFeature({
            events: [
              ExampleEventHandler1,
            ],
          }),
        ],
      }).compileComponents();

      const eventBus = TestBed.inject(EventBus);
      const handler1 = TestBed.inject(ExampleEventHandler1);

      const handleMethod1 = spyOn(handler1, 'handle').and.callThrough();

      await eventBus.publish(new ExampleEvent('One'));

      expect(handleMethod1).toHaveBeenCalledTimes(1);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('One'));


      await eventBus.publish(new ExampleEvent('Two'));

      expect(handleMethod1).toHaveBeenCalledTimes(2);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('Two'));


      await eventBus.publish(new ExampleEvent('Three'));

      expect(handleMethod1).toHaveBeenCalledTimes(3);
      expect(handleMethod1).toHaveBeenLastCalledWith(new ExampleEvent('Three'));
    });

    it('should handle the event using corresponding event handlers', async () => {
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

      const eventBus = TestBed.inject(EventBus);
      const handler1 = TestBed.inject(ExampleEventHandler1);
      const handler2 = TestBed.inject(ExampleEventHandler2);

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

    it('should not throw an error when the event has no handlers', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forRoot(),
          CqrsModule.forFeature({}),
        ],
      }).compileComponents();

      const eventBus = TestBed.inject(EventBus);

      await expect(eventBus.publish(new ExampleEvent('One'))).resolves.not.toThrow();
    });
  });
});
