import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { BadRequestException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { promisify } from 'util'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { CreateUsuarioCommand } from "./create-usuario.command"
import { Usuario } from "src/usuarios/entities/usuario.entity"
import { Entregador } from "src/usuarios/entities/entregador.entity"

const scrypt = promisify(_scrypt)

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand, string> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(command: CreateUsuarioCommand): Promise<string> {
    return await this.dataSource.transaction(async (db) => {
      const existUser = await db.findOne(Usuario, {
        where: { email: command.email }
      })
      if (existUser) throw new BadRequestException('Email já cadastrado')

      const salt = randomBytes(8).toString('hex')
      const hash = await scrypt(command.password, salt, 32) as Buffer
      const saltAndHash = salt + '.' + hash.toString('hex')
      command.password = saltAndHash

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