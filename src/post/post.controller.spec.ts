import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';

describe('PostController', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: PostService,
          useValue: {
            createPost: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', async () => {
    const controller = new PostController(service);
    await controller.createPost('xxx-xxx-xxx-xxx', 'Hello World');
    expect(service.createPost).toHaveBeenCalledTimes(1);
  });
});
