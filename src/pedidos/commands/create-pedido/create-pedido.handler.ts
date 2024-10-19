import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { CreatePedidoCommand } from "./create-pedido.command"
import { Pedido } from "src/pedidos/entities/pedido.entity"

@CommandHandler(CreatePedidoCommand)
export class CreatePedidoHandler implements ICommandHandler<CreatePedidoCommand, string> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(command: CreatePedidoCommand): Promise<string> {
    return await this.dataSource.transaction(async (db) => {
      command.createdAt = new Date().toJSON()
      const pedido = db.create(Pedido, command)

      await db.save(pedido)

      return pedido.id_pedido
    })
  }
}