import { BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { CommandHandler } from "@nestjs/cqrs"
import { DataSource } from "typeorm"
import { Pedido } from "src/domain/pedidos/entities/pedido.entity"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"
import { AssignEntregadorCommand } from "./assign-entregador.command"
import { DomainEventsDispatcher } from "src/domain/shared/domain-events/domain-events-dispatcher"

@CommandHandler(AssignEntregadorCommand)
export class AssignEntregadorHandler {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventDispatcher: DomainEventsDispatcher
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