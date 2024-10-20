import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { BadRequestException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"
import { DataSource } from "typeorm"
import { promisify } from 'util'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { CreateUsuarioCommand } from "./create-usuario.command"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"
import { Entregador } from "src/domain/usuarios/entities/entregador.entity"
import { ReturnLoginUsuarioCommand } from "../login-usuario/login-usuario.command"

const scrypt = promisify(_scrypt)

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand, ReturnLoginUsuarioCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) { }

  async execute(command: CreateUsuarioCommand): Promise<ReturnLoginUsuarioCommand> {
    return await this.dataSource.transaction(async (db) => {
      const existUser = await db.findOne(Usuario, {
        where: { email: command.email }
      })
      if (existUser) throw new BadRequestException('Email já cadastrado')
      
      const existDocument = await db.findOne(Usuario, {
        where: { document: command.document }
      })
      if (existDocument) throw new BadRequestException('CPF/CNPJ já cadastrado')

      const salt = randomBytes(8).toString('hex')
      const hash = await scrypt(command.password, salt, 32) as Buffer
      const saltAndHash = salt + '.' + hash.toString('hex')
      command.password = saltAndHash

      let entregador: Entregador

      if (command.type == 2) {
        entregador = db.create(Entregador, command.entregador)
      } else {
        command.entregador = null
      }

      command.createdAt = new Date().toJSON()
      const usuario = db.create(Usuario, {
        ...command,
        entregador
      })

      try {
        await db.save(usuario)
      } catch (error) {
        console.log(error)
        throw new BadRequestException('Erro ao criar usuário')
      }

      const { password: _, ...result } = usuario
      const payload = { id_usuario: usuario.id_usuario, email: usuario.email }

      const access_token = this.jwtService.sign(
        { ...payload, type: 'access' },
        { expiresIn: '1h' }
      )

      const refresh_token = this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: '1d' }
      )

      return {
        user_data: result,
        access_token,
        refresh_token
      }
    })
  }
}