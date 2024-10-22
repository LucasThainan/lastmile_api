import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { NotFoundException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { CreatePedidoCommand } from "./create-pedido.command"
import { Pedido } from "src/domain/pedidos/entities/pedido.entity"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"
import { PedidoCreatedEvent } from "../../events/pedido-created/pedido-created.event"

@CommandHandler(CreatePedidoCommand)
export class CreatePedidoHandler implements ICommandHandler<CreatePedidoCommand, string> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus
  ) { }

  async execute(command: CreatePedidoCommand): Promise<string> {
    return await this.dataSource.transaction(async (db) => {
      const usuario = await db.findOne(Usuario, {
        where: { id_usuario: command.cod_user }
      })
      if (!usuario) throw new NotFoundException("Usuario não encontrado")

      command.createdAt = new Date().toJSON()
      const pedido = db.create(Pedido, command)

      try {
        await db.save(pedido)
      } catch (error) {
        console.log(error)
      }

      await this.eventBus.publish(new PedidoCreatedEvent(pedido))

      return pedido.id_pedido
    })
  }
}