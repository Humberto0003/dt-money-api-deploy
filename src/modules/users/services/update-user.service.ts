import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDto) {
    const userExists = await this.userRepository.findById(id);

    const updateData = { ...data };

    if (data.email && data.email !== userExists.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(data.email);

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictException("User already exists");
      }
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.update(id, updateData);
    return user;
  }
}
