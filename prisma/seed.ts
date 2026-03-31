import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import { getEnv } from "../src/lib/env-core";

const env = getEnv();
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
  connectionString: env.DATABASE_URL,
  }),
});

async function main() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
    },
  });

  console.log(`Admin seeded: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
