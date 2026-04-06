import { Transform } from 'class-transformer';
import {
  IsEmail,
  MinLength,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => {
    const trimmedValue = value?.trim();
    return trimmedValue === '' ? null : trimmedValue;
  })
  lastName?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email?: string;
}
