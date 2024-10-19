import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { EntregadorAssignedEvent } from "./entregador-assigned.event"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"

@EventsHandler(EntregadorAssignedEvent)
export class EntregadorAssigned_SendMessageHandler implements IEventHandler<EntregadorAssignedEvent> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }
  
  async handle(event: EntregadorAssignedEvent) {
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { id_usuario: event.id_usuario }
    })

    const entregador = await this.dataSource.manager.findOne(Usuario, {
      where: { cod_entregador: event.id_entregador }
    })

    console.log("Mensagem enviada para o usuário: ", usuario.name)
  }
}