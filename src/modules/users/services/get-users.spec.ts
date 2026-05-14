import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "../infra/repositories/user.repository.abstract";
import { GetUsersService } from "./get-users.service";

describe("GetUsersService", () => {
  let service: GetUsersService;

  const userMockRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get<GetUsersService>(GetUsersService);
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    const users = [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test User",
        email: "test@email.com",
      },
    ];

    userMockRepository.findAll.mockResolvedValue(users);

    const result = await service.execute();

    expect(userMockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });
});
