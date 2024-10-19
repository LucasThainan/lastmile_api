import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DataSource } from "typeorm"
import { InjectDataSource } from "@nestjs/typeorm"
import { UpdateUsuarioCommand } from "./update-usuario.command"
import { Usuario } from "src/usuarios/entities/usuario.entity"

@CommandHandler(UpdateUsuarioCommand)
export class UpdateUsuarioHandler implements ICommandHandler<UpdateUsuarioCommand, number> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(command: UpdateUsuarioCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const usuario = await db.findOne(Usuario, {
        where: { id_usuario: command.id_usuario },
        relations: ['entregador']
      })

      if (!usuario) return 0

      command.updatedAt = new Date().toJSON()
      db.merge(Usuario, usuario, command)
      await db.save(Usuario, usuario)

      return 1
    })
  }
}