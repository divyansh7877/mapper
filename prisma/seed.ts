import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Sports", slug: "sports", icon: "🏀", color: "#ef4444" },
  { name: "Technology", slug: "technology", icon: "💻", color: "#3b82f6" },
  { name: "Music", slug: "music", icon: "🎵", color: "#8b5cf6" },
  { name: "Art", slug: "art", icon: "🎨", color: "#ec4899" },
  { name: "Food & Drink", slug: "food-drink", icon: "🍕", color: "#f97316" },
  { name: "Books", slug: "books", icon: "📚", color: "#14b8a6" },
  { name: "Gaming", slug: "gaming", icon: "🎮", color: "#22c55e" },
  { name: "Fitness", slug: "fitness", icon: "💪", color: "#eab308" },
  { name: "Photography", slug: "photography", icon: "📷", color: "#6366f1" },
  { name: "Outdoors", slug: "outdoors", icon: "🏕️", color: "#22c55e" },
  { name: "Business", slug: "business", icon: "💼", color: "#0ea5e9" },
  { name: "Education", slug: "education", icon: "🎓", color: "#8b5cf6" },
  { name: "Social", slug: "social", icon: "👥", color: "#f472b6" },
  { name: "Volunteer", slug: "volunteer", icon: "❤️", color: "#ef4444" },
];

async function main() {
  console.log("Seeding categories...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`Created/updated: ${cat.name}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
