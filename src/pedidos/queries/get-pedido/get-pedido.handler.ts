import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { plainToClass } from "class-transformer"
import { DataSource } from "typeorm"
import { PedidoDto } from "./pedido.dto"
import { GetPedidoQuery } from "./get-pedido.query"
import { Pedido } from "src/pedidos/entities/pedido.entity"

@QueryHandler(GetPedidoQuery)
export class GetPedidoHandler implements IQueryHandler<GetPedidoQuery, PedidoDto | null> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(query: GetPedidoQuery): Promise<PedidoDto | null> {
    const data = await this.dataSource.manager.find(Pedido, {
      where: { id_pedido: query.id_pedido },
      relations: ['usuario', 'entregador']
    })

    if (!data.length) return null

    return plainToClass(PedidoDto, data[0])
  }
}