import { Type } from '@angular/core';
import { IQuery } from './query.interface';

export interface QueryHandler<TResult = any, TQuery extends IQuery<TResult> = IQuery<TResult>> {
  readonly handles: Type<TQuery>;

  execute(query: TQuery): Promise<TResult>;
}
