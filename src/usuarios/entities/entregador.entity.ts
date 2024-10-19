import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('entregadores')
export class Entregador {
  @PrimaryGeneratedColumn('uuid')
  id_entregador: string

  @Column()
  cnh: string

  @Column()
  placa_veiculo: string
}
