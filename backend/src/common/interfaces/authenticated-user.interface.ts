export interface AuthenticatedUser {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}
