import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma.service";
import { CreateUserDto } from "../../../dto/create-user.dto";
import { UpdateUserDto } from "../../../dto/update-user.dto";
import { IUserRepository } from "../user.repository.abstract";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.create({
      data,
    });

    return this.withoutPassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.withoutPassword(user));
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.withoutPassword(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return this.withoutPassword(user);
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return this.withoutPassword(user);
  }

  private withoutPassword<T extends { password: string }>(user: T) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
