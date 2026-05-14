import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDto) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
