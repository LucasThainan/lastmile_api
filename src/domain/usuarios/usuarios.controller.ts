import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query, UseGuards, HttpCode } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetUsuarioQuery } from './queries/get-usuario/get-usuario.query'
import { GetUsuariosQuery } from './queries/get-usuarios/get-usuarios.query'
import { CreateUsuarioDto } from './commands/create-usuario/create-usuario.dto'
import { CreateUsuarioCommand } from './commands/create-usuario/create-usuario.command'
import { UpdateUsuarioDto } from './commands/update-usuario/update-usuario.dto'
import { UpdateUsuarioCommand } from './commands/update-usuario/update-usuario.command'
import { LoginUsuarioDto } from './commands/login-usuario/login-usuario.dto'
import { LoginUsuarioCommand } from './commands/login-usuario/login-usuario.command'
import { RefreshTokenCommand } from './commands/refresh-token/refresh-token.command'
import { RefreshTokenDto } from './commands/refresh-token/refresh-token.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const command = plainToClass(LoginUsuarioCommand, loginUsuarioDto)
    return await this.commandBus.execute(command)
  }

  @ApiBearerAuth()
  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const command = plainToClass(RefreshTokenCommand, refreshTokenDto)
    return await this.commandBus.execute(command)
  }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const command = plainToClass(CreateUsuarioCommand, createUsuarioDto)
    return await this.commandBus.execute(command)
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'params',
    required: false,
    type: GetUsuarioQuery,
    description: 'Filtros de busca'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: Number, enum: [1, 2] })
  async findAll(@Query() params: string) {
    const query = plainToClass(GetUsuariosQuery, params)
    return await this.queryBus.execute(query)
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    const usuario = await this.queryBus.execute(query)
    return { user: usuario }
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const command = plainToClass(UpdateUsuarioCommand, { id_usuario: id, ...updateUsuarioDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Usuario não encontrado')

    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    const usuario = await this.queryBus.execute(query)
    return { user: usuario }
  }
}
