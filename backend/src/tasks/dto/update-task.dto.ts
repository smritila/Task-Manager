import { Transform } from 'class-transformer';
import {
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string | null }) => {
    if (value === null) {
      return null;
    }

    const trimmedValue = value?.trim();
    return trimmedValue === '' ? null : trimmedValue;
  })
  description?: string | null;

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: (typeof TASK_STATUSES)[number];

  @IsOptional()
  @IsISO8601()
  startDateTime?: string | null;

  @IsOptional()
  @IsISO8601()
  endDateTime?: string | null;
}
