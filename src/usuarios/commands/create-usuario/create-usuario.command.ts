export class CreateUsuarioCommand {
  name: string
  email: string
  password: string
  document: string
  phone: string
  type: number
  createdAt: string
  status_usuario: number
  entregador?: {
    cnh: string
    placa_veiculo: string
  }
}