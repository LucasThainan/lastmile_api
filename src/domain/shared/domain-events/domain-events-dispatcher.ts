import { Injectable } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"
import { BaseEntity } from "../base-entity"

@Injectable()
export class DomainEventsDispatcher {
  constructor(private readonly eventBus: EventBus) { }

  async dispatch(entity: BaseEntity): Promise<void> {
    await Promise.all(
      entity.getEvents().map((event) => this.eventBus.publish(event))
    )
    entity.clearEvents()
  }
}