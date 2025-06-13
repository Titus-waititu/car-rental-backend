// Utility to remove sensitive fields from user objects
import { User } from './entities/user.entity';

export function sanitizeUser(
  user: User | null | undefined,
): Partial<User> | null {
  if (!user) return null;
  const { password, hashedRefreshToken, ...safeUser } = user;
  return safeUser;
}
