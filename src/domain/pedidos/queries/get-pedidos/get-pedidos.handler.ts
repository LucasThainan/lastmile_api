import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { Brackets, DataSource } from "typeorm"
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
    const pedidos = await this.dataSource.manager.getRepository(Pedido)
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.usuario', 'usuario')
      .leftJoinAndSelect('pedido.entregador', 'entregador')
      .where(
        new Brackets(qb => {
          qb.where('pedido.cod_user = :cod_user', { cod_user: query.cod_user })
            .orWhere('pedido.cod_entregador = :cod_entregador', { cod_entregador: query.cod_entregador })

          if (query.cod_entregador) {
            qb.orWhere('pedido.status_pedido = :status_pedido', { status_pedido: 1 })
          }
        })
      )
      .orderBy('pedido.createdAt', 'DESC')
      .take(query.limit)
      .skip(query.offset)
      .getMany()

    const total = await this.dataSource.manager.getRepository(Pedido)
      .createQueryBuilder('pedido')
      .where(
        new Brackets(qb => {
          qb.where('pedido.cod_user = :cod_user', { cod_user: query.cod_user })
            .orWhere('pedido.cod_entregador = :cod_entregador', { cod_entregador: query.cod_entregador })

          if (query.cod_entregador) {
            qb.orWhere('pedido.status_pedido = :status_pedido', { status_pedido: 1 })
          }
        })
      )
      .getCount()

    return {
      pedidos: pedidos,
      total: total
    }
  }
}