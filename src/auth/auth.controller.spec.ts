import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAuth: jest.fn().mockReturnValue({ token: 'dummy', user_id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    const controller = new AuthController(service);
    await controller.getAuth('test-user', 'test-password');

    expect(service.getAuth).toHaveBeenCalledTimes(1);
  });
});
