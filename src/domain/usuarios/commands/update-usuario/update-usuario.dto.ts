import { PartialType } from '@nestjs/swagger'
import { CreateUsuarioDto } from '../create-usuario/create-usuario.dto'

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) { }