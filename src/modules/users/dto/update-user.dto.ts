import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ description: "Nome do usuario", example: "Humberto" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "E-mail do usuario", example: "usuario@email.com" })
  @IsOptional()
  @IsEmail({}, { message: "O e-mail deve ser valido" })
  email?: string;

  @ApiPropertyOptional({ description: "Senha do usuario", example: "senha123", minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  password?: string;
}
