import { Usuario } from "src/domain/usuarios/entities/usuario.entity"

export class LoginUsuarioCommand {
  email: string
  password: string
}

export class ReturnLoginUsuarioCommand {
  user_data: Omit<Usuario, 'password'>
  access_token: string
  refresh_token: string
}