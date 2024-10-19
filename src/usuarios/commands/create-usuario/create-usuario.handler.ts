import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { CreateUsuarioCommand } from "./create-usuario.command"
import { Usuario } from "src/usuarios/entities/usuario.entity"
import { Entregador } from "src/usuarios/entities/entregador.entity"

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand, string> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(command: CreateUsuarioCommand): Promise<string> {
    return await this.dataSource.transaction(async (db) => {
      let entregador: Entregador

      if (command.type == 2) {
        entregador = db.create(Entregador, command.entregador)
      }

      command.createdAt = new Date().toJSON()
      const usuario = db.create(Usuario, {
        ...command,
        entregador
      })

      try {
        await db.save(usuario)
      } catch (error) {
        return ''
      }

      return usuario.id_usuario
    })
  }
}