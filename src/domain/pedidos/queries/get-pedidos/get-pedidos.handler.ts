import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { GetPedidosDto } from "./get-pedidos.dto"
import { GetPedidosQuery } from "./get-pedidos.query"
import { Pedido } from "src/domain/pedidos/entities/pedido.entity"

@QueryHandler(GetPedidosQuery)
export class GetPedidosHandler implements IQueryHandler<GetPedidosQuery, GetPedidosDto | null> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(query: GetPedidosQuery): Promise<GetPedidosDto | null> {
    const pedidos = await this.dataSource.manager.find(Pedido, {
      where: {
        cod_user: query.cod_user,
        cod_entregador: query.cod_entregador
      },
      relations: ['usuario', 'entregador'],
      take: query.limit,
      skip: query.offset
    })

    const total = await this.dataSource.manager.find(Pedido, {
      where: {
        cod_user: query.cod_user,
        cod_entregador: query.cod_entregador
      }
    })

    return {
      pedidos: pedidos,
      total: total.length
    }
  }
}