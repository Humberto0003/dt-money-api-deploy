import { Body, Controller, HttpStatus, Param, Put, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UpdateUserService } from "../services/update-user.service";

@ApiTags("users")
@Controller("users")
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put("/:id")
  @ApiOperation({ summary: "Atualizar um usuario" })
  @ApiResponse({ status: HttpStatus.OK, description: "Usuario atualizado com sucesso.", type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Dados de entrada invalidos." })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Usuario nao encontrado." })
  @ApiBody({ type: UpdateUserDto, description: "Dados para atualizacao do usuario" })
  @ApiParam({ name: "id", description: "ID do usuario a ser atualizado", example: "123e4567-e89b-12d3-a456-426614174000" })
  async updateUser(
    @Param("id") id: string,
    @Body() data: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.updateUserService.execute(id, data);
    return res.status(HttpStatus.OK).json(user);
  }
}
