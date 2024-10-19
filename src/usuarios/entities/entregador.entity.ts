import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"

@Entity('entregadores')
export class Entregador {
  @PrimaryGeneratedColumn('uuid')
  id_entregador: string

  @Column()
  @Unique(['cnh'])
  cnh: string

  @Column()
  placa_veiculo: string
}
