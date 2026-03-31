import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import { getEnv } from "../src/lib/env";

const env = getEnv();
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter: new PrismaNeon(pool),
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
    await pool.end();
  });
