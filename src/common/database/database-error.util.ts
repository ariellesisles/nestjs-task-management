import { QueryFailedError } from 'typeorm';

export function getUniqueViolationConstraint(
  error: unknown,
): string | null {
  if (!(error instanceof QueryFailedError)) {
    return null;
  }

  const driverError = error.driverError as {
    code?: string;
    constraint?: string;
  };

  if (driverError.code !== '23505') {
    return null;
  }

  return driverError.constraint ?? null;
}