import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ofType } from '@ngry/rx';
import { ICommand } from '../command/command.interface';
import { CommandHandler } from '../command/command-handler';
import { IEvent } from '../event/event.interface';
import { EventBus } from '../event/event-bus';
import { CqrsModule } from '../cqrs.module';
import { Saga } from './saga';

//#region Commands

class FirstCommand implements ICommand {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class SecondCommand implements ICommand {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class ThirdCommand implements ICommand {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class FinishCommand implements ICommand {
  constructor(
    readonly result: Array<string>,
  ) {
  }
}

//#endregion

//#region Events

class InitEvent implements IEvent {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class FirstDoneEvent implements IEvent {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class SecondDoneEvent implements IEvent {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class ThirdDoneEvent implements IEvent {
  constructor(
    readonly data: Array<string>,
  ) {
  }
}

class DoneEvent implements IEvent {
  constructor(
    readonly result: Array<string>,
  ) {
  }
}

//#endregion

//#region Command handlers

@Injectable()
export class FirstCommandHandler implements CommandHandler<FirstCommand> {
  readonly handles = FirstCommand;

  constructor(
    private eventBus: EventBus,
  ) {
  }

  async execute(command: FirstCommand): Promise<void> {
    this.eventBus.publish(new FirstDoneEvent([...command.data, 'first']));
  }
}

@Injectable()
export class SecondCommandHandler implements CommandHandler<SecondCommand> {
  readonly handles = SecondCommand;

  constructor(
    private eventBus: EventBus,
  ) {
  }

  async execute(command: SecondCommand): Promise<void> {
    this.eventBus.publish(new SecondDoneEvent([...command.data, 'second']));
  }
}

@Injectable()
export class ThirdCommandHandler implements CommandHandler<ThirdCommand> {
  readonly handles = ThirdCommand;

  constructor(
    private eventBus: EventBus,
  ) {
  }

  async execute(command: ThirdCommand): Promise<void> {
    this.eventBus.publish(new ThirdDoneEvent([...command.data, 'third']));
  }
}

@Injectable()
export class FinishCommandHandler implements CommandHandler<FinishCommand> {
  readonly handles = FinishCommand;

  constructor(
    private eventBus: EventBus,
  ) {
  }

  async execute(command: FinishCommand): Promise<void> {
    this.eventBus.publish(new DoneEvent([...command.result, 'finish']));
  }
}

//#endregion

//#region Saga implementation

@Injectable()
class ExampleSaga implements Saga {
  transform(events: Observable<IEvent>): Observable<ICommand> {
    return merge(
      events.pipe(
        ofType(InitEvent),
        map(event => new FirstCommand(event.data)),
      ),
      events.pipe(
        ofType(FirstDoneEvent),
        map(event => new SecondCommand(event.data)),
      ),
      events.pipe(
        ofType(SecondDoneEvent),
        map(event => new ThirdCommand(event.data)),
      ),
      events.pipe(
        ofType(ThirdDoneEvent),
        map(event => new FinishCommand(event.data)),
      ),
    );
  }
}

//#endregion

describe('Saga', () => {
  it('should execute saga pipeline', async (done) => {
    await TestBed.configureTestingModule({
      imports: [
        CqrsModule.forFeature({
          commands: [
            FirstCommandHandler,
            SecondCommandHandler,
            ThirdCommandHandler,
            FinishCommandHandler,
          ],
          sagas: [
            ExampleSaga,
          ],
        }),
      ],
    }).compileComponents();

    const eventBus = TestBed.inject(EventBus);

    eventBus.events.pipe(
      ofType(DoneEvent),
    ).subscribe(event => {
      expect(event.result).toEqual(['init', 'first', 'second', 'third', 'finish']);

      done();
    });

    eventBus.publish(new InitEvent(['init']));
  });
});
