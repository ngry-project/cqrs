import { Injectable } from '@angular/core';
import { ICommand } from './command.interface';
import { CommandHandlerRegistry } from './command-handler-registry';

@Injectable({
  providedIn: 'root',
})
export class CommandBus {

  constructor(
    private readonly registry: CommandHandlerRegistry,
  ) {
  }

  async execute(command: ICommand): Promise<void> {
    await this.registry.of(command).execute(command);
  }
}
