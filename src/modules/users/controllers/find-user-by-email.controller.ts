import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { UserResponseDto } from "../dto/user-response.dto";
import { FindUserByEmailService } from "../services/find-user-by-email.service";

@ApiTags("users")
@Controller("users")
export class FindUserByEmailController {
  constructor(private readonly findUserByEmailService: FindUserByEmailService) {}

  @Get("/email/:email")
  @ApiOperation({ summary: "Buscar um usuario por e-mail" })
  @ApiResponse({ status: HttpStatus.OK, description: "Usuario encontrado com sucesso.", type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Usuario nao encontrado." })
  @ApiParam({ name: "email", description: "E-mail do usuario a ser buscado", example: "usuario@email.com" })
  async handle(@Param("email") email: string, @Res() res: Response) {
    const user = await this.findUserByEmailService.execute(email);
    return res.status(HttpStatus.OK).json(user);
  }
}
