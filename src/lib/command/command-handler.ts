import { Type } from '@angular/core';
import { ICommand } from './command.interface';

export interface CommandHandler<TCommand extends ICommand = ICommand> {
  readonly handles: Type<TCommand>;

  execute(command: TCommand): Promise<void>;
}
