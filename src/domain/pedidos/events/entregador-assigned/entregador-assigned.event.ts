export class EntregadorAssignedEvent {
  constructor(
    public readonly id_entregador: string,
    public readonly id_usuario: string,
    public readonly id_pedido: string
  ) {}
}