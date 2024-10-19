import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query, UseGuards, HttpCode } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetUsuarioQuery } from './queries/get-usuario/get-usuario.query'
import { GetUsuariosQuery } from './queries/get-usuarios/get-usuarios.query'
import { CreateUsuarioDto } from './commands/create-usuario/create-usuario.dto'
import { CreateUsuarioCommand } from './commands/create-usuario/create-usuario.command'
import { UpdateUsuarioDto } from './commands/update-usuario/update-usuario.dto'
import { UpdateUsuarioCommand } from './commands/update-usuario/update-usuario.command'
import { LoginUsuarioDto } from './commands/login-usuario/login-usuario.dto'
import { LoginUsuarioCommand } from './commands/login-usuario/login-usuario.command'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RefreshTokenCommand } from './commands/refresh-token/refresh-token.command'
import { RefreshTokenDto } from './commands/refresh-token/refresh-token.dto'

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const command = plainToClass(CreateUsuarioCommand, createUsuarioDto)
    const id = await this.commandBus.execute(command)
    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    return this.queryBus.execute(query)
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const command = plainToClass(LoginUsuarioCommand, loginUsuarioDto)
    return await this.commandBus.execute(command)
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const command = plainToClass(RefreshTokenCommand, refreshTokenDto)
    return await this.commandBus.execute(command)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() params: string) {
    const query = plainToClass(GetUsuariosQuery, params)
    return await this.queryBus.execute(query)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    const usuario = await this.queryBus.execute(query)
    if (!usuario) throw new NotFoundException('Usuario não encontrado')

    return usuario
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const command = plainToClass(UpdateUsuarioCommand, { id_usuario: id, ...updateUsuarioDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Usuario não encontrado')

    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    return this.queryBus.execute(query)
  }
}
