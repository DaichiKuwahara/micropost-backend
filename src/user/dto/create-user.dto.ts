import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: '名前は2文字以上必要です' })
  name: string;

  @IsEmail({}, { message: '正しいメールアドレスを入力してください' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上必要です' })
  password: string;
}
