import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetUsuarioQuery } from './queries/get-usuario/get-usuario.query'
import { GetUsuariosQuery } from './queries/get-usuarios/get-usuarios.query'
import { CreateUsuarioDto } from './commands/create-usuario/create-usuario.dto'
import { CreateUsuarioCommand } from './commands/create-usuario/create-usuario.command'
import { UpdateUsuarioDto } from './commands/update-usuario/update-usuario.dto'
import { UpdateUsuarioCommand } from './commands/update-usuario/update-usuario.command'

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const command = plainToClass(CreateUsuarioCommand, createUsuarioDto)
    const id = await this.commandBus.execute(command)
    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    return this.queryBus.execute(query)
  }

  @Get()
  async findAll(@Query() params: string) {
    const query = plainToClass(GetUsuariosQuery, params)
    return await this.queryBus.execute(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    const usuario = await this.queryBus.execute(query)

    if (!usuario) throw new NotFoundException('Usuario não encontrado')

    return usuario
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const command = plainToClass(UpdateUsuarioCommand, { id_usuario: id, ...updateUsuarioDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Usuario não encontrado')

    const query = plainToClass(GetUsuarioQuery, { id_usuario: id })
    return this.queryBus.execute(query)
  }
}
