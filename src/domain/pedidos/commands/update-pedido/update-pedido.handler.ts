import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { UpdatePedidoCommand } from "./update-pedido.command"
import { Pedido } from "src/domain/pedidos/entities/pedido.entity"

@CommandHandler(UpdatePedidoCommand)
export class UpdatePedidoHandler implements ICommandHandler<UpdatePedidoCommand, number> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(command: UpdatePedidoCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const pedido = await db.findOne(Pedido, {
        where: { id_pedido: command.id_pedido }
      })
      if (!pedido) return 0

      command.updatedAt = new Date().toJSON()
      db.merge(Pedido, pedido, command)
      await db.save(Pedido, pedido)

      return 1
    })
  }
}