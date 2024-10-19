import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetPedidoQuery } from './queries/get-pedido/get-pedido.query'
import { GetPedidosQuery } from './queries/get-pedidos/get-pedidos.query'
import { CreatePedidoDto } from './commands/create-pedido/create-pedido.dto'
import { CreatePedidoCommand } from './commands/create-pedido/create-pedido.command'
import { UpdatePedidoDto } from './commands/update-pedido/update-pedido.dto'
import { UpdatePedidoCommand } from './commands/update-pedido/update-pedido.command'
import { AssignEntregadorCommand } from './commands/assign-entregador/assign-entregador.command'
import { AssignEntregadorDto } from './commands/assign-entregador/assign-entregador.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    const command = plainToClass(CreatePedidoCommand, createPedidoDto)
    const id = await this.commandBus.execute(command)
    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    return this.queryBus.execute(query)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() params: string) {
    const query = plainToClass(GetPedidosQuery, params)
    return await this.queryBus.execute(query)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    const pedido = await this.queryBus.execute(query)

    if (!pedido) throw new NotFoundException('Pedido não encontrado')

    return pedido
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    const command = plainToClass(UpdatePedidoCommand, { id_pedido: id, ...updatePedidoDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Pedido não encontrado')

    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    return this.queryBus.execute(query)
  }

  @Patch('assign-entregador/:id')
  @UseGuards(JwtAuthGuard)
  async assignEntregador(@Param('id') id: string, @Body() assignEntregadorDto: AssignEntregadorDto) {
    const command = plainToClass(AssignEntregadorCommand, { id_pedido: id, ...assignEntregadorDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Pedido não encontrado')

    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    return this.queryBus.execute(query)
  }
}
