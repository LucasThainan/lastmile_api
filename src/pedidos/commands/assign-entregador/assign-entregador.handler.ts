import { CommandHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { Pedido } from "src/pedidos/entities/pedido.entity"
import { AssignEntregadorCommand } from "./assign-entregador.command"
import { EntityEventsDispatcher } from "src/common/events/entity-events-dispatcher"
import { Usuario } from "src/usuarios/entities/usuario.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"

@CommandHandler(AssignEntregadorCommand)
export class AssignEntregadorHandler {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher
  ) { }

  async execute(command: AssignEntregadorCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const pedido = await db.findOne(Pedido, {
        where: { id_pedido: command.id_pedido }
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
      await this.eventDispatcher.dispatch(pedido)

      return 1
    })
  }
}