import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

describe('UserController', () => {
  let service: UserService; // 差し替え用のサービス

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // テスト本体

  it('should be defined', async () => {
    const controller = new UserController(service); // テスト対象のコントローラ作成

    await controller.getUser(1, 'xxx-xxx-xxx-xxx'); // getUser関数の呼び出し

    expect(service.getUser).toHaveBeenCalledTimes(1); // 呼び出し回数の確認
  });
});
