import { Injectable } from '@nestjs/common'
import { CreateEntregadorDto } from './dto/create-entregador.dto'
import { UpdateEntregadorDto } from './dto/update-entregador.dto'
import { Entregador } from './entities/entregador.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EntregadoresService {
  constructor(
    @InjectRepository(Entregador)
    private readonly repository: Repository<Entregador>,
  ) {}

  create(createEntregadorDto: CreateEntregadorDto): Promise<Entregador> {
    const entregador = this.repository.create(createEntregadorDto)
    return this.repository.save(entregador)
  }

  findAll(): Promise<Entregador[]> {
    return this.repository.find()
  }

  findOne(id: string): Promise<Entregador | null> {
    return this.repository.findOneBy({ id })
  }

  async update(id: string, updateEntregadorDto: UpdateEntregadorDto): Promise<Entregador | null> {
    const entregador = await this.repository.findOneBy({ id })
    if (!entregador) return null
    this.repository.merge(entregador, updateEntregadorDto)
    return this.repository.save(entregador)
  }

  async remove(id: string): Promise<Entregador | null> {
    const entregador = await this.repository.findOneBy({ id })
    if (!entregador) return null
    return this.repository.remove(entregador)
  }
}
