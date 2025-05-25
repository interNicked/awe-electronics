import { PrismaResource } from "./PrismaResource";

export abstract class User {
  id: string;
  email: string;
  passwordHash: string;

  protected constructor({
    id,
    email,
    passwordHash,
  }: {
    id: string;
    email: string;
    passwordHash: string;
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  /** Register & verify email flow */
  static register(email: string, rawPassword: string): User {
    // delegate to service that hashes + stores, then send verification
    throw new Error('implemented in application layer');
  }

  abstract login(mfaToken: string): Promise<void>;
  abstract resetPassword(tempToken: string, newPassword: string): Promise<void>;
}
