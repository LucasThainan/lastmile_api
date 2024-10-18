import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('entregadores')
export class Entregador {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  phone: string

  @Column()
  cnh: string

  @Column()
  habilitado: boolean

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}
