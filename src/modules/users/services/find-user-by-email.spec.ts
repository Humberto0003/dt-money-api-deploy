import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { FindUserByEmailService } from "./find-user-by-email.service";

describe("FindUserByEmailService", () => {
  let service: FindUserByEmailService;

  const userMockRepository = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<FindUserByEmailService>(FindUserByEmailService);
    jest.clearAllMocks();
  });

  it("should return an existing user", async () => {
    const user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test User",
      email: "test@email.com",
    };

    userMockRepository.findByEmail.mockResolvedValue(user);

    const result = await service.execute(user.email);

    expect(userMockRepository.findByEmail).toHaveBeenCalledWith(user.email);
    expect(result).toEqual(user);
  });

  it("should throw when user is not found", async () => {
    userMockRepository.findByEmail.mockResolvedValue(null);

    await expect(service.execute("missing@email.com")).rejects.toBeInstanceOf(NotFoundException);
  });
});
