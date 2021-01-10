import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CqrsModule } from '../cqrs.module';
import { QueryBus } from './query-bus';
import { QueryHandler } from './query-handler';
import { IQuery } from './query.interface';

class ExampleQuery implements IQuery<Array<string>> {
  constructor(
    readonly data: string,
  ) {
  }
}

@Injectable()
class ExampleQueryHandler implements QueryHandler<Array<string>, ExampleQuery> {
  readonly handles = ExampleQuery;

  async execute(query: ExampleQuery): Promise<Array<string>> {
    return [
      query.data,
      query.data,
      query.data,
    ];
  }
}

describe('QueryBus', () => {
  let queryBus: QueryBus;
  let handler: ExampleQueryHandler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CqrsModule.forRoot(),
        CqrsModule.forFeature({
          queries: [
            ExampleQueryHandler,
          ],
        }),
      ],
    }).compileComponents();

    queryBus = TestBed.inject(QueryBus);
    handler = TestBed.inject(ExampleQueryHandler);

    expect(queryBus).toBeInstanceOf(QueryBus);
    expect(handler).toBeInstanceOf(ExampleQueryHandler);
  });

  describe('execute', () => {
    it('should execute queries using corresponding query handler', async () => {
      const executeMethod = spyOn(handler, 'execute').and.callThrough();

      const first = await queryBus.execute(new ExampleQuery('One'));

      expect(executeMethod).toHaveBeenCalledTimes(1);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleQuery('One'));
      expect(first).toEqual(['One', 'One', 'One']);


      const second = await queryBus.execute(new ExampleQuery('Two'));

      expect(executeMethod).toHaveBeenCalledTimes(2);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleQuery('Two'));
      expect(second).toEqual(['Two', 'Two', 'Two']);


      const third = await queryBus.execute(new ExampleQuery('Three'));

      expect(executeMethod).toHaveBeenCalledTimes(3);
      expect(executeMethod).toHaveBeenLastCalledWith(new ExampleQuery('Three'));
      expect(third).toEqual(['Three', 'Three', 'Three']);
    });
  });
});
