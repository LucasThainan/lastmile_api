import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnauthorizedException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"
import { DataSource } from "typeorm"
import { RefreshTokenCommand, ReturnRefreshTokenCommand } from "./refresh-token.command"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) { }

  async execute(command: RefreshTokenCommand): Promise<ReturnRefreshTokenCommand> {
    const payload = this.jwtService.verify(command.refresh_token)
    if (payload.type != 'refresh') throw new UnauthorizedException('Tipo de token inválido')

    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { id_usuario: payload.id_usuario }
    })
    if (!usuario) throw new UnauthorizedException('Refresh token inválido')

    const new_payload = { id_usuario: usuario.id_usuario, email: usuario.email }

    const new_access_token = this.jwtService.sign(
      { ...new_payload, type: 'access' },
      { expiresIn: '1h' }
    )

    const new_refresh_token = this.jwtService.sign(
      { ...new_payload, type: 'refresh' },
      { expiresIn: '1d' }
    )

    return { 
      access_token: new_access_token, 
      refresh_token: new_refresh_token
    }
  }
}