import { Injectable } from '@angular/core';
import { QueryHandler } from './query-handler';
import { IQuery } from './query.interface';

@Injectable()
export class QueryHandlerRegistry {
  private readonly handlers = new Set<QueryHandler>();

  of<TResult>(query: IQuery<TResult>): QueryHandler<TResult> {
    const handlers = new Set<QueryHandler>();

    for (const handler of this.handlers) {
      if (query instanceof handler.handles) {
        handlers.add(handler);
      }
    }

    if (handlers.size === 0) {
      throw new Error(`No query handler found for query of type ${query.constructor.name}`);
    }

    if (handlers.size > 1) {
      throw new Error(`More than one query handlers found for query of type ${query.constructor.name}`);
    }

    return [...handlers][0];
  }

  register(handler: QueryHandler): void {
    if (this.handlers.has(handler)) {
      throw new Error(`${handler.constructor.name} already registered`);
    }

    this.handlers.add(handler);
  }
}
