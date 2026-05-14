import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { FindUserByIdService } from "./find-user-by-id.service";

describe("FindUserByIdService", () => {
  let service: FindUserByIdService;

  const userMockRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<FindUserByIdService>(FindUserByIdService);
    jest.clearAllMocks();
  });

  it("should return an existing user", async () => {
    const user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test User",
      email: "test@email.com",
    };

    userMockRepository.findById.mockResolvedValue(user);

    const result = await service.execute(user.id);

    expect(userMockRepository.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  it("should throw when user is not found", async () => {
    userMockRepository.findById.mockRejectedValue(new NotFoundException("User not found"));

    await expect(service.execute("missing-id")).rejects.toBeInstanceOf(NotFoundException);
  });
});
