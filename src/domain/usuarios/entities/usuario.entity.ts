import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MinLength } from "class-validator"
import { Entregador } from "src/domain/usuarios/entities/entregador.entity"

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  @MinLength(6)
  password: string

  @Column({ unique: true })
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
