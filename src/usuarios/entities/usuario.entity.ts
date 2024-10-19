import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Entregador } from "src/usuarios/entities/entregador.entity"

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string

  @Column()
  name: string

  @Column()
  @Unique(['email'])
  email: string

  @Column()
  password: string

  @Column()
  @Unique(['document'])
  document: string

  @Column()
  phone: string

  @Column()
  type: number

  @Column()
  createdAt: Date

  @Column({ nullable: true })
  updatedAt?: Date

  @Column()
  status_usuario: number

  @OneToOne(() => Entregador, { cascade: true })
  @JoinColumn({ name: 'cod_entregador', referencedColumnName: 'id_entregador' })
  entregador?: Entregador

  @Column({ nullable: true})
  cod_entregador?: string
}
