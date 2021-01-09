import { Inject, InjectionToken, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommandBus } from './command/command-bus';
import { CommandHandler } from './command/command-handler';
import { CommandHandlerRegistry } from './command/command-handler-registry';
import { EventBus } from './event/event-bus';
import { EventHandler } from './event/event-handler';
import { EventHandlerRegistry } from './event/event-handler-registry';
import { QueryBus } from './query/query-bus';
import { QueryHandler } from './query/query-handler';
import { QueryHandlerRegistry } from './query/query-handler-registry';
import { ErrorBus } from './error/error-bus';
import { ErrorHandler } from './error/error-handler';
import { ErrorHandlerRegistry } from './error/error-handler-registry';
import { Saga } from './saga/saga';
import { SagaHandlerRegistry } from './saga/saga-handler-registry';

export interface CqrsFeatureOptions {
  events?: Array<Type<EventHandler>>;
  commands?: Array<Type<CommandHandler>>;
  queries?: Array<Type<QueryHandler>>;
  errors?: Array<Type<ErrorHandler>>;
  sagas?: Array<Type<Saga>>;
}

export const CQRS_FEATURE_OPTIONS = new InjectionToken<CqrsFeatureOptions>('CQRS feature');

@NgModule()
export class CqrsFeatureModule {
  constructor(
    @Inject(CQRS_FEATURE_OPTIONS) options: CqrsFeatureOptions,
    injector: Injector,
    eventHandlerRegistry: EventHandlerRegistry,
    commandHandlerRegistry: CommandHandlerRegistry,
    queryHandlerRegistry: QueryHandlerRegistry,
    errorHandlerRegistry: ErrorHandlerRegistry,
    sagaHandlerRegistry: SagaHandlerRegistry,
  ) {
    const {events = [], commands = [], queries = [], errors = [], sagas = []} = options;

    for (const type of events) {
      eventHandlerRegistry.register(injector.get(type));
    }

    for (const type of commands) {
      commandHandlerRegistry.register(injector.get(type));
    }

    for (const type of queries) {
      queryHandlerRegistry.register(injector.get(type));
    }

    for (const type of errors) {
      errorHandlerRegistry.register(injector.get(type));
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
        EventHandlerRegistry,
        EventBus,
        CommandBus,
        CommandHandlerRegistry,
        QueryBus,
        QueryHandlerRegistry,
        ErrorBus,
        ErrorHandlerRegistry,
        SagaHandlerRegistry,
      ],
    };
  }

  static forFeature(options: CqrsFeatureOptions): ModuleWithProviders<CqrsFeatureModule> {
    const {events = [], commands = [], queries = [], errors = [], sagas = []} = options;

    return {
      ngModule: CqrsFeatureModule,
      providers: [
        ...events,
        ...commands,
        ...queries,
        ...errors,
        ...sagas,
        {
          provide: CQRS_FEATURE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
