import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { DeleteUserService } from "./delete-user.service";

describe("DeleteUserService", () => {
  let service: DeleteUserService;

  const userMockRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    jest.clearAllMocks();
  });

  it("should delete an existing user", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";

    userMockRepository.findById.mockResolvedValue({
      id,
      name: "Test User",
      email: "test@email.com",
    });
    userMockRepository.delete.mockResolvedValue(undefined);

    await service.execute(id);

    expect(userMockRepository.findById).toHaveBeenCalledWith(id);
    expect(userMockRepository.delete).toHaveBeenCalledWith(id);
  });

  it("should throw when user is not found", async () => {
    userMockRepository.findById.mockRejectedValue(new NotFoundException("User not found"));

    await expect(service.execute("missing-id")).rejects.toBeInstanceOf(NotFoundException);
    expect(userMockRepository.delete).not.toHaveBeenCalled();
  });
});
