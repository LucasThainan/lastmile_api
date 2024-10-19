import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnauthorizedException } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt'
import { DataSource } from "typeorm"
import { promisify } from 'util'
import { scrypt as _scrypt } from 'crypto'
import { InjectDataSource } from "@nestjs/typeorm"
import { Usuario } from "src/usuarios/entities/usuario.entity"
import { LoginUsuarioCommand, ReturnLoginUsuarioCommand } from "./login-usuario.command"

const scrypt = promisify(_scrypt)

@CommandHandler(LoginUsuarioCommand)
export class LoginUsuarioHandler implements ICommandHandler<LoginUsuarioCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) { }

  async execute(command: LoginUsuarioCommand): Promise<ReturnLoginUsuarioCommand> {
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { email: command.email }
    })
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado')

    const [salt, storedHash] = usuario.password.split('.')
    const hash = (await scrypt(command.password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Senha inválida')
    }

    const { password: _, ...result } = usuario
    const payload = { id_usuario: usuario.id_usuario, email: usuario.email }

    const access_token = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: '60s' }
    )

    const refresh_token = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '1h' }
    )

    return {
      user_data: result,
      access_token,
      refresh_token
    }
  }
}