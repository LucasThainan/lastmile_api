import { Controller, Get, Post, Body, Patch, Param, NotFoundException, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetPedidoQuery } from './queries/get-pedido/get-pedido.query'
import { GetPedidosQuery } from './queries/get-pedidos/get-pedidos.query'
import { CreatePedidoDto } from './commands/create-pedido/create-pedido.dto'
import { CreatePedidoCommand } from './commands/create-pedido/create-pedido.command'
import { UpdatePedidoDto } from './commands/update-pedido/update-pedido.dto'
import { UpdatePedidoCommand } from './commands/update-pedido/update-pedido.command'

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    const command = plainToClass(CreatePedidoCommand, createPedidoDto)
    const id = await this.commandBus.execute(command)
    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    return this.queryBus.execute(query)
  }

  @Get()
  async findAll(@Query() params: string) {
    const query = plainToClass(GetPedidosQuery, params)
    return await this.queryBus.execute(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    const pedido = await this.queryBus.execute(query)

    if (!pedido) throw new NotFoundException('Pedido não encontrado')

    return pedido
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    const command = plainToClass(UpdatePedidoCommand, { id_pedido: id, ...updatePedidoDto })
    const affectedRows = await this.commandBus.execute(command)
    if (!affectedRows) throw new NotFoundException('Pedido não encontrado')

    const query = plainToClass(GetPedidoQuery, { id_pedido: id })
    return this.queryBus.execute(query)
  }
}
