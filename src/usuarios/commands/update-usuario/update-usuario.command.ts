export class UpdateUsuarioCommand {
  id_usuario: string
  name?: string
  phone?: string
  updatedAt: string
  status_usuario?: number
  entregador?: {
    cnh: string
    placa_veiculo: string
  }
}