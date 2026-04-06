import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

interface UserRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateUserInput {
  firstName: string;
  lastName?: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await this.databaseService.query<UserRow>(
      `SELECT id, first_name, last_name, email, password_hash, created_at, updated_at
       FROM public.users
       WHERE email = $1`,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findById(id: number): Promise<UserRow | null> {
    const result = await this.databaseService.query<UserRow>(
      `SELECT id, first_name, last_name, email, password_hash, created_at, updated_at
       FROM public.users
       WHERE id = $1`,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async createUser(input: CreateUserInput): Promise<UserRow> {
    try {
      const result = await this.databaseService.query<UserRow>(
        `INSERT INTO public.users (first_name, last_name, email, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, last_name, email, password_hash, created_at, updated_at`,
        [
          input.firstName,
          input.lastName?.trim() || null,
          input.email,
          input.passwordHash,
        ],
      );

      return result.rows[0];
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }

      throw error;
    }
  }

  toAuthenticatedUser(user: UserRow): AuthenticatedUser {
    return {
      id: Number(user.id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    };
  }

  private isUniqueViolation(error: unknown): error is { code: string } {
    return Boolean(
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === '23505',
    );
  }
}
