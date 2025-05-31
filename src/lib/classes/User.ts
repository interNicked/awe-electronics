import Prisma from "@prisma/client";
import { Customer } from "./Customer";
import { PrismaResource } from "./PrismaResource";

export abstract class User {
  id: string;
  email: string;
  passwordHash: string;
  abstract role: Prisma.$Enums.UserRole

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

  serialize() {
    return {
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
    };
  }
}
