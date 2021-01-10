import { Inject, InjectionToken, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommandBus } from './command/command-bus';
import { CommandHandler } from './command/command-handler';
import { CommandHandlerRegistry } from './command/command-handler-registry';
import { EventBus } from './event/event-bus';
import { QueryBus } from './query/query-bus';
import { QueryHandler } from './query/query-handler';
import { QueryHandlerRegistry } from './query/query-handler-registry';
import { Saga } from './saga/saga';
import { SagaHandlerRegistry } from './saga/saga-handler-registry';

export interface CqrsFeatureOptions {
  commands?: Array<Type<CommandHandler>>;
  queries?: Array<Type<QueryHandler>>;
  sagas?: Array<Type<Saga>>;
}

export const CQRS_FEATURE_OPTIONS = new InjectionToken<CqrsFeatureOptions>('CQRS feature');

@NgModule()
class CqrsFeatureModule {
  constructor(
    @Inject(CQRS_FEATURE_OPTIONS) options: CqrsFeatureOptions,
    injector: Injector,
    commandHandlerRegistry: CommandHandlerRegistry,
    queryHandlerRegistry: QueryHandlerRegistry,
    sagaHandlerRegistry: SagaHandlerRegistry,
  ) {
    const {commands = [], queries = [], sagas = []} = options;

    for (const type of commands) {
      commandHandlerRegistry.register(injector.get(type));
    }

    for (const type of queries) {
      queryHandlerRegistry.register(injector.get(type));
    }

    for (const type of sagas) {
      sagaHandlerRegistry.register(injector.get(type));
    }
  }
}

@NgModule()
export class CqrsModule {

  static forRoot(): ModuleWithProviders<CqrsModule> {
    return {
      ngModule: CqrsModule,
      providers: [
        EventBus,
        CommandBus,
        CommandHandlerRegistry,
        QueryBus,
        QueryHandlerRegistry,
        SagaHandlerRegistry,
      ],
    };
  }

  static forFeature(options: CqrsFeatureOptions): ModuleWithProviders<CqrsFeatureModule> {
    const {commands = [], queries = [], sagas = []} = options;

    return {
      ngModule: CqrsFeatureModule,
      providers: [
        ...commands,
        ...queries,
        ...sagas,
        {
          provide: CQRS_FEATURE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
