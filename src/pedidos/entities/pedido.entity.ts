import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Entregador } from "src/usuarios/entities/entregador.entity"
import { Usuario } from "src/usuarios/entities/usuario.entity"

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id_pedido: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ nullable: true })
  comments?: string

  @Column()
  address: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  number: string

  @Column()
  postal_code: string

  @Column()
  createdAt: Date

  @Column({ nullable: true })
  updatedAt?: Date

  @Column()
  status_pedido: number

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'cod_user', referencedColumnName: 'id_usuario' })
  usuario: Usuario

  @Column()
  cod_user: string

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'cod_entregador', referencedColumnName: 'cod_entregador' })
  entregador?: Usuario

  @Column({ nullable: true })
  cod_entregador?: string
}
