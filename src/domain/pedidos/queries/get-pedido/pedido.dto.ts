import { Exclude, Expose, Type } from "class-transformer"
import { UsuarioDto } from "src/domain/usuarios/queries/get-usuario/usuario.dto"

@Exclude()
export class PedidoDto {
  @Expose()
  id_pedido: string
  
  @Expose()
  name: string
  
  @Expose()
  description: string
  
  @Expose()
  comments?: string
  
  @Expose()
  address: string
  
  @Expose()
  city: string
  
  @Expose()
  state: string
  
  @Expose()
  number: string
  
  @Expose()
  postal_code: string
  
  @Expose()
  createdAt: Date
  
  @Expose()
  updatedAt?: Date
  
  @Expose()
  status_pedido: number
  
  @Type(() => UsuarioDto)
  @Expose()
  usuario: UsuarioDto

  @Type(() => UsuarioDto)
  @Expose()
  entregador?: UsuarioDto
}