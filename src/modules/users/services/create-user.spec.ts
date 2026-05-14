import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { CreateUserService } from "./create-user.service";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

describe("CreateUserService", () => {
  let service: CreateUserService;

  const userMockRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const createUserDto: CreateUserDto = {
      name: "Test User",
      email: "test@email.com",
      password: "secret123",
    };

    const createdUser = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    userMockRepository.create.mockResolvedValue(createdUser);

    const result = await service.execute(createUserDto);

    expect(userMockRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: "hashed-password",
    });
    expect(result).toEqual(createdUser);
    expect(result).not.toHaveProperty("password");
  });

  it("should hash the password before creating the user", async () => {
    const createUserDto: CreateUserDto = {
      name: "Test User",
      email: "test@email.com",
      password: "secret123",
    };

    userMockRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    userMockRepository.create.mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.execute(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
  });

  it("should not allow duplicated email", async () => {
    const createUserDto: CreateUserDto = {
      name: "Test User",
      email: "test@email.com",
      password: "secret123",
    };

    userMockRepository.findByEmail.mockResolvedValue({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Existing User",
      email: createUserDto.email,
    });

    await expect(service.execute(createUserDto)).rejects.toBeInstanceOf(ConflictException);
    expect(userMockRepository.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
