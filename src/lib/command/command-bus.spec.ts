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

@Injectable()
class SecondExampleCommandHandler implements CommandHandler<ExampleCommand> {
  readonly handles = ExampleCommand;

  execute(command: ExampleCommand): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('CommandBus', () => {
  describe('execute', () => {
    it('should execute the command using corresponding command handler', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forFeature({
            commands: [
              ExampleCommandHandler,
            ],
          }),
        ],
      }).compileComponents();

      const commandBus = TestBed.inject(CommandBus);
      const handler = TestBed.inject(ExampleCommandHandler);

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

    it('should throw an error when the command has no handler', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forFeature({}),
        ],
      }).compileComponents();

      const commandBus = TestBed.inject(CommandBus);

      await expect(commandBus.execute(new ExampleCommand('One'))).rejects.toThrow('No command handler found for command of type ExampleCommand');
    });

    it('should throw an error when the command has multiple handlers', async () => {
      await TestBed.configureTestingModule({
        imports: [
          CqrsModule.forFeature({
            commands: [
              ExampleCommandHandler,
              SecondExampleCommandHandler
            ],
          }),
        ],
      }).compileComponents();

      const commandBus = TestBed.inject(CommandBus);

      await expect(commandBus.execute(new ExampleCommand('One'))).rejects.toThrow('More than one command handlers found for command of type ExampleCommand');
    });
  });
});
