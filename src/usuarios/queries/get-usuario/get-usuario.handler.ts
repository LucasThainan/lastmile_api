import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { InjectDataSource } from "@nestjs/typeorm"
import { plainToClass } from "class-transformer"
import { DataSource } from "typeorm"
import { UsuarioDto } from "./usuario.dto"
import { GetUsuarioQuery } from "./get-usuario.query"
import { Usuario } from "src/usuarios/entities/usuario.entity"

@QueryHandler(GetUsuarioQuery)
export class GetUsuarioHandler implements IQueryHandler<GetUsuarioQuery, UsuarioDto | null> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async execute(query: GetUsuarioQuery): Promise<UsuarioDto | null> {
    const data = await this.dataSource.manager.find(Usuario, {
      where: { id_usuario: query.id_usuario },
      relations: ['entregador']
    })

    if (!data.length) return null

    return plainToClass(UsuarioDto, data[0])
  }
}