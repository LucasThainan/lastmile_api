import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { NotFoundException } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"
import { GetUsuariosDto } from "./get-usuarios.dto"
import { GetUsuariosQuery } from "./get-usuarios.query"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"

@QueryHandler(GetUsuariosQuery)
export class GetUsuariosHandler implements IQueryHandler<GetUsuariosQuery, GetUsuariosDto[] | null> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }

  async execute(query: GetUsuariosQuery): Promise<GetUsuariosDto[] | null> {
    const data = await this.dataSource.manager.find(Usuario, {
      where: { type: query.type },
      relations: ['entregador'],
      take: query.limit,
      skip: query.offset
    })

    if (!data.length) throw new NotFoundException('Usuarios não encontrado')

    return data
  }
}