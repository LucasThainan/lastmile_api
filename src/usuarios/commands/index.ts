import { CreateUsuarioHandler } from "./create-usuario/create-usuario.handler"
import { LoginUsuarioHandler } from "./login-usuario/login-usuario.handler"
import { UpdateUsuarioHandler } from "./update-usuario/update-usuario.handler"

export const CommandHandlers = [CreateUsuarioHandler, UpdateUsuarioHandler, LoginUsuarioHandler]