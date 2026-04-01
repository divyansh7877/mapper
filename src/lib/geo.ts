import { PrismaClient } from "@prisma/client";

export async function findGroupsNearby({
  prisma,
  latitude,
  longitude,
  radiusKm = 50,
  categorySlug,
  limit = 50,
}: {
  prisma: PrismaClient;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  categorySlug?: string;
  limit?: number;
}) {
  const earthRadiusKm = 6371;

  const latDelta = radiusKm / earthRadiusKm;
  const lonDelta = radiusKm / (earthRadiusKm * Math.cos((latitude * Math.PI) / 180));

  const minLat = latitude - latDelta;
  const maxLat = latitude + latDelta;
  const minLon = longitude - lonDelta;
  const maxLon = longitude + lonDelta;

  return prisma.group.findMany({
    where: {
      latitude: { gte: minLat, lte: maxLat },
      longitude: { gte: minLon, lte: maxLon },
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      category: true,
      _count: { select: { members: true } },
    },
    take: limit,
  });
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
