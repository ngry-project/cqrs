import { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Type } from '@angular/core';

export function ofType<I extends object, O extends I>(...types: Array<Type<O>>): OperatorFunction<I, O> {
  return (source: Observable<I>): Observable<O> => {
    const isInstanceOf = (object: object): object is O => {
      return !!types.find(type => object instanceof type);
    };

    return source.pipe(filter(isInstanceOf));
  };
}
