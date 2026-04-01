import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mapper",
  },
});
