import { Exclude, Expose } from "class-transformer"

@Exclude()
export class EntregadorDto {
  @Expose()
  id_entregador: string

  @Expose()
  cnh: string

  @Expose()
  placa_veiculo: string
}