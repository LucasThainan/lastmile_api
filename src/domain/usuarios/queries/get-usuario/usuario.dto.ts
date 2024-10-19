import { Exclude, Expose, Type } from "class-transformer"
import { EntregadorDto } from "./entregador.dto"

@Exclude()
export class UsuarioDto {
  @Expose()
  id_usuario: string
  
  @Expose()
  name: string
  
  @Expose()
  email: string
  
  @Expose()
  password: string
  
  @Expose()
  document: string
  
  @Expose()
  phone: string
  
  @Expose()
  type: number
  
  @Expose()
  createdAt: Date
  
  @Expose()
  updatedAt?: Date
  
  @Expose()
  status_usuario: number
  
  @Type(() => EntregadorDto)
  @Expose()
  entregador?: EntregadorDto
}