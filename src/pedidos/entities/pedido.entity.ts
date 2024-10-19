import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "src/usuarios/entities/usuario.entity"
import { EntityBase } from "src/common/entities/entity-base"
import { EntregadorAssignedEvent } from "../events/entregador-assigned/entregador-assigned.event"

@Entity('pedidos')
export class Pedido extends EntityBase {
  #entregador?: Usuario
  #cod_entregador?: string

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
  get entregador(): Usuario | undefined {
    return this.#entregador
  }
  set entregador(value: Usuario | undefined) {
    this.cod_entregador = value?.cod_entregador
    this.#entregador = value
  }

  @Column({ nullable: true })
  get cod_entregador(): string | undefined {
    return this.#cod_entregador
  }
  set cod_entregador(value: string | undefined) {
    if (value && value !== this.#cod_entregador) {
      this.addEvent(new EntregadorAssignedEvent(value, this.cod_user, this.id_pedido))
    }
    this.#cod_entregador = value
  }
}
