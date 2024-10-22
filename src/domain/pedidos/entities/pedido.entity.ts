import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "src/domain/usuarios/entities/usuario.entity"

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

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cod_user', referencedColumnName: 'id_usuario' })
  usuario: Usuario

  @Column()
  cod_user: string

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cod_entregador', referencedColumnName: 'cod_entregador' })
  entregador?: Usuario

  @Column({ nullable: true })
  cod_entregador?: string
}
