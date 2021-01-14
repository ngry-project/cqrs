import { Injectable } from '@angular/core';
import { IQuery } from './query.interface';
import { QueryHandlerRegistry } from './query-handler-registry';

@Injectable({
  providedIn: 'root',
})
export class QueryBus {

  constructor(
    private readonly registry: QueryHandlerRegistry,
  ) {
  }

  async execute<TResult>(query: IQuery<TResult>): Promise<TResult | never> {
    return this.registry.of(query).execute(query);
  }
}
