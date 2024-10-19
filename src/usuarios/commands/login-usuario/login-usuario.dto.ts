import { PartialType } from "@nestjs/mapped-types"
import { CreateUsuarioDto } from "../create-usuario/create-usuario.dto"

export class LoginUsuarioDto extends PartialType(CreateUsuarioDto) {}