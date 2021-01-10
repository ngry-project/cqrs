import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CqrsModule } from '../cqrs.module';
import { CommandBus } from './command-bus';
import { CommandHandler } from './command-handler';

class ExampleCommand {
  constructor(
    readonly data: string,
  ) {
  }
}

@Injectable()
class ExampleCommandHandler implements CommandHandler<ExampleCommand> {
  readonly handles = ExampleCommand;

  execute(command: ExampleCommand): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('CommandBus', () => {
  let commandBus: CommandBus;
  let handler: ExampleCommandHandler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CqrsModule.forRoot(),
        CqrsModule.forFeature({
          commands: [
            ExampleCommandHandler,
          ],
        }),
      ],
    }).compileComponents();

    commandBus = TestBed.inject(CommandBus);
    handler = TestBed.inject(ExampleCommandHandler);

    expect(commandBus).toBeInstanceOf(CommandBus);
    expect(handler).toBeInstanceOf(ExampleCommandHandler);
  });

  describe('execute', () => {
    it('should execute command using corresponding command handler', async () => {
      const executeMethod = spyOn(handler, 'execute').and.callThrough();

      await commandBus.execute(new ExampleCommand('One'));

      expect(executeMethod).toHaveBeenCalledTimes(1);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleCommand('One'));


      await commandBus.execute(new ExampleCommand('Two'));

      expect(executeMethod).toHaveBeenCalledTimes(2);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleCommand('Two'));


      await commandBus.execute(new ExampleCommand('Three'));

      expect(executeMethod).toHaveBeenCalledTimes(3);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleCommand('Three'));
    });
  });
});
