import "dotenv/config"
import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join("src", "lib", "database", "prisma", "schema.prisma"),
  migrations: {
    path: path.join("src", "lib", "database", "prisma", "migrations"),
    // seed: "tsx prisma/seed.execute.ts",
  },
})
