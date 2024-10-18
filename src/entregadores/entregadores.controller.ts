import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException } from '@nestjs/common'
import { EntregadoresService } from './entregadores.service'
import { CreateEntregadorDto } from './dto/create-entregador.dto'
import { UpdateEntregadorDto } from './dto/update-entregador.dto'

@Controller('entregadores')
export class EntregadoresController {
  constructor(private readonly entregadoresService: EntregadoresService) {}

  @Post()
  create(@Body() createEntregadorDto: CreateEntregadorDto) {
    return this.entregadoresService.create(createEntregadorDto)
  }

  @Get()
  findAll() {
    return this.entregadoresService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entregador = await this.entregadoresService.findOne(id)
    if (!entregador) throw new NotFoundException()
    return entregador
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEntregadorDto: UpdateEntregadorDto) {
    const entregador = await this.entregadoresService.update(id, updateEntregadorDto)
    if (!entregador) throw new NotFoundException()
    return entregador
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const entregador = await this.entregadoresService.remove(id)
    if (!entregador) throw new NotFoundException()
  }
}
