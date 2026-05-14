import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "Nome do usuario", example: "Humberto" })
  @IsString()
  @IsNotEmpty({ message: "O nome e obrigatorio" })
  name: string;

  @ApiProperty({ description: "E-mail do usuario", example: "usuario@email.com" })
  @IsNotEmpty({ message: "O e-mail e obrigatorio" })
  @IsEmail({}, { message: "O e-mail deve ser valido" })
  email: string;

  @ApiProperty({ description: "Senha do usuario", example: "senha123", minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: "A senha e obrigatoria" })
  @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
  password: string;
}
