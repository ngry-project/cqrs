import { Injectable } from '@angular/core';
import { CommandHandler } from './command-handler';
import { ICommand } from './command.interface';

@Injectable({
  providedIn: 'root',
})
export class CommandHandlerRegistry {
  private readonly handlers = new Set<CommandHandler>();

  of(command: ICommand): CommandHandler | never {
    const handlers = new Set<CommandHandler>();

    for (const handler of this.handlers) {
      if (command instanceof handler.handles) {
        handlers.add(handler);
      }
    }

    if (handlers.size === 0) {
      throw new Error(`No command handler found for command of type ${command.constructor.name}`);
    }

    if (handlers.size > 1) {
      throw new Error(`More than one command handlers found for command of type ${command.constructor.name}`);
    }

    return [...handlers][0];
  }

  register(handler: CommandHandler): void {
    if (this.handlers.has(handler)) {
      throw new Error(`${handler.constructor.name} already registered`);
    }

    this.handlers.add(handler);
  }
}
