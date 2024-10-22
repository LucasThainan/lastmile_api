import { BadRequestException, NotFoundException } from "@nestjs/common"
import { CommandHandler, EventBus } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { Pedido } from "src/domain/pedidos/entities/pedido.entity"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"
import { AssignEntregadorCommand } from "./assign-entregador.command"
import { EntregadorAssignedEvent } from "../../events/entregador-assigned/entregador-assigned.event"

@CommandHandler(AssignEntregadorCommand)
export class AssignEntregadorHandler {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus
  ) { }

  async execute(command: AssignEntregadorCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const pedido = await db.findOne(Pedido, {
        where: { id_pedido: command.id_pedido },
        relations: ['entregador']
      })
      if (!pedido) return 0
      if (pedido.cod_entregador) throw new BadRequestException("Pedido já atribuído")

      const entregador = await db.findOne(Usuario, {
        where: { cod_entregador: command.cod_entregador }
      })
      if (!entregador) throw new NotFoundException("Entregador não encontrado")

      command.updatedAt = new Date().toJSON()
      command.status_pedido = 2
      db.merge(Pedido, pedido, command)

      await db.save(Pedido, pedido)

      pedido.entregador = entregador
      await this.eventBus.publish(new EntregadorAssignedEvent(pedido))

      return 1
    })
  }
}