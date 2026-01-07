import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth } from '../entities/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const hash = createHash('md5').update(password).digest('hex');

    const existingUser = await this.userRepository.findOne({
      where: { umail: Equal(email) },
    });
    if (existingUser) {
      throw new ForbiddenException('このメールアドレスは既に登録されています');
    }
    const record = {
      name: name,

      umail: email,

      hash: hash,
    };

    this.userRepository.save(record);
  }

  async getUser(token: string, id: number) {
    // ログイン済みかチェック

    const now = new Date();

    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),

        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'icon_url'],
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }

  // 名前を更新する
  async updateProfile(
    id: number,
    name: string,
    token: string,
    iconUrl?: string,
  ) {
    const now = new Date();

    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),

        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    if (Number(auth.user_id) !== Number(id)) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.update(id, { name, icon_url: iconUrl });
    return { success: true };
  }
}
