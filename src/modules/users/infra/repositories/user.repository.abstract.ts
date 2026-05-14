import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";

export abstract class IUserRepository {
  abstract create(data: CreateUserDto);
  abstract findAll();
  abstract findById(id: string);
  abstract findByEmail(email: string);
  abstract delete(id: string);
  abstract update(id: string, data: UpdateUserDto);
}
