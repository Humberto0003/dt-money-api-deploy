import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { CreateUserService } from "../services/create-user.service";

@ApiTags("users")
@Controller("users")
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post("")
  @ApiOperation({ summary: "Criar um novo usuario" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Usuario criado com sucesso.", type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Dados de entrada invalidos." })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "Usuario ja existe." })
  @ApiBody({ type: CreateUserDto, description: "Dados para criacao do usuario" })
  async createUser(@Body() data: CreateUserDto, @Res() res: Response) {
    const user = await this.createUserService.execute(data);
    return res.status(HttpStatus.CREATED).json(user);
  }
}
