
export abstract class PrismaResource {
    abstract createdAt: Date | String;
    abstract updatedAt: Date | String;

    abstract create(args: unknown): Promise<unknown>;
    abstract read(args: unknown): Promise<unknown>;
    abstract update(args: unknown): Promise<unknown>;
    abstract delete(args: unknown): Promise<unknown>;
}