import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"
import { EntityBase } from "../entities/entity-base"

@Injectable()
export class EntityEventsDispatcher {
  constructor(private readonly eventBus: EventBus) { }

  async dispatch(entity: EntityBase): Promise<void> {
    await Promise.all(
      entity.getEvents().map((event) => this.eventBus.publish(event))
    )
    entity.clearEvents()
  }
}