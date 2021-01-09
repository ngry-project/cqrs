import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CqrsModule } from '../cqrs.module';
import { CommandBus } from './command-bus';
import { CommandHandler } from './command-handler';

class SaveCommand {
  constructor(
    readonly data: string
  ) {
  }
}

@Injectable()
class SaveHandler implements CommandHandler<SaveCommand> {
  readonly handles = SaveCommand;

  execute(command: SaveCommand): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('CommandBus', () => {
  let commandBus: CommandBus;
  let handler: SaveHandler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CqrsModule.forRoot(),
        CqrsModule.forFeature({
          commands: [
            SaveHandler
          ]
        })
      ]
    }).compileComponents();

    commandBus = TestBed.inject(CommandBus);
    handler = TestBed.inject(SaveHandler);

    expect(commandBus).toBeInstanceOf(CommandBus);
    expect(handler).toBeInstanceOf(SaveHandler);
  });

  it('should execute the command', async () => {
    const executeMethod = spyOn(handler, 'execute').and.callThrough();

    await commandBus.execute(new SaveCommand('One'));

    expect(executeMethod).toHaveBeenCalledTimes(1);
    expect(executeMethod).toHaveBeenLastCalledWith(new SaveCommand('One'));


    await commandBus.execute(new SaveCommand('Two'));

    expect(executeMethod).toHaveBeenCalledTimes(2);
    expect(executeMethod).toHaveBeenLastCalledWith(new SaveCommand('Two'));


    await commandBus.execute(new SaveCommand('Three'));

    expect(executeMethod).toHaveBeenCalledTimes(3);
    expect(executeMethod).toHaveBeenLastCalledWith(new SaveCommand('Three'));
  });
});
