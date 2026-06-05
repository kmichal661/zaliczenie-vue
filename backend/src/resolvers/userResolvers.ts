import { AppDataSource } from "../data-source";
import { User } from "../entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userResolvers = {
  Query: {
    users: async () => {
      const repo = AppDataSource.getRepository(User);
      return repo.find();
    },
    user: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(User);
      return repo.findOne({ where: { userId: args.id } });
    },
  },
  Mutation: {
    createUser: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(User);
      const input = { ...args.input };
      if (input.roleId) {
        delete input.roleId;
      }
      if (input.password) {
        const salt = await bcrypt.genSalt(10);
        input.password = await bcrypt.hash(input.password, salt);
      }
      const r = repo.create(input);
      return repo.save(r);
    },
    register: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(User);
      const input = { ...args.input };

      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(input.password, salt);
      const r = repo.create(input as any);
      const savedRaw = await repo.save(r);
      const saved = Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
      const token = jwt.sign(
        { userId: saved.userId },
        process.env.JWT_SECRET || "dev_secret",
        {
          expiresIn: "7d",
        },
      );
      return { token, user: saved };
    },
    updateUser: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(User);
      const input = { ...args.input };
      if (input.roleId) {
        // const roleRepo = AppDataSource.getRepository(Role);
        // const role = await roleRepo.findOne({ where: { id: input.roleId } });
        // if (role) input.role = role;
        delete input.roleId;
      }
      await repo.update({ userId: args.id }, input);
      return repo.findOne({ where: { userId: args.id } });
    },
    deleteUser: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(User);
      const res = await repo.delete({ userId: args.id });
      return res.affected && res.affected > 0;
    },
    login: async (_: any, args: { email: string; password: string }) => {
      const repo = AppDataSource.getRepository(User);
      const user = (await repo.findOne({
        where: { email: args.email },
      })) as User | null;
      if (!user) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) throw new Error("Invalid credentials");
      const token = jwt.sign(
        { userId: user.userId },
        process.env.JWT_SECRET || "dev_secret",
        {
          expiresIn: "7d",
        },
      );
      return { token, user };
    },
  },
};
