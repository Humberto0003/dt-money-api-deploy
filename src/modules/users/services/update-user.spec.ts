import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcrypt";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { UpdateUserService } from "./update-user.service";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

describe("UpdateUserService", () => {
  let service: UpdateUserService;

  const userMockRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
    jest.clearAllMocks();
  });

  it("should update user data", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const updateUserDto: UpdateUserDto = {
      name: "Updated User",
      email: "updated@email.com",
    };

    const existingUser = {
      id,
      name: "Test User",
      email: "test@email.com",
    };

    const updatedUser = {
      id,
      ...updateUserDto,
    };

    userMockRepository.findById.mockResolvedValue(existingUser);
    userMockRepository.findByEmail.mockResolvedValue(null);
    userMockRepository.update.mockResolvedValue(updatedUser);

    const result = await service.execute(id, updateUserDto);

    expect(userMockRepository.findById).toHaveBeenCalledWith(id);
    expect(userMockRepository.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
    expect(userMockRepository.update).toHaveBeenCalledWith(id, updateUserDto);
    expect(result).toEqual(updatedUser);
  });

  it("should hash the new password when password is provided", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const updateUserDto: UpdateUserDto = {
      password: "newsecret123",
    };

    userMockRepository.findById.mockResolvedValue({
      id,
      name: "Test User",
      email: "test@email.com",
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("new-hashed-password");
    userMockRepository.update.mockResolvedValue({
      id,
      name: "Test User",
      email: "test@email.com",
    });

    await service.execute(id, updateUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 10);
    expect(userMockRepository.update).toHaveBeenCalledWith(id, {
      password: "new-hashed-password",
    });
  });

  it("should not allow duplicated email", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const updateUserDto: UpdateUserDto = {
      email: "duplicated@email.com",
    };

    userMockRepository.findById.mockResolvedValue({
      id,
      name: "Test User",
      email: "test@email.com",
    });
    userMockRepository.findByEmail.mockResolvedValue({
      id: "another-user-id",
      name: "Another User",
      email: updateUserDto.email,
    });

    await expect(service.execute(id, updateUserDto)).rejects.toBeInstanceOf(ConflictException);
    expect(userMockRepository.update).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
