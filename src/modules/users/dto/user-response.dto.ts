import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "ID do usuario", example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ description: "Nome do usuario", example: "Humberto" })
  name: string;

  @ApiProperty({ description: "E-mail do usuario", example: "usuario@email.com" })
  email: string;

  @ApiProperty({ description: "Data de criacao do usuario", example: "2026-05-14T12:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ description: "Data da ultima atualizacao do usuario", example: "2026-05-14T12:00:00.000Z" })
  updatedAt: Date;
}
