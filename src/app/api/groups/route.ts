import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/geo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "50";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let groups;

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      const earthRadiusKm = 6371;
      const latDelta = radiusKm / earthRadiusKm;
      const lonDelta =
        radiusKm / (earthRadiusKm * Math.cos((latitude * Math.PI) / 180));

      groups = await prisma.group.findMany({
        where: {
          latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
          longitude: { gte: longitude - lonDelta, lte: longitude + lonDelta },
          ...(category && { category: { slug: category } }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          category: true,
          creator: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { members: true } },
        },
        take: 100,
      });
    } else {
      groups = await prisma.group.findMany({
        where: {
          ...(category && { category: { slug: category } }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          category: true,
          creator: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { members: true } },
        },
        take: 50,
      });
    }

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Groups GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const body = await request.json();
    const { name, description, categoryId, latitude, longitude, address, isPublic } = body;

    if (!name || !categoryId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Name, category, and location are required" },
        { status: 400 }
      );
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!dbUser && user) {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: user.fullName || user.firstName,
          avatarUrl: user.imageUrl,
        },
      });
    }

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.group.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const group = await prisma.group.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        latitude,
        longitude,
        address,
        isPublic: isPublic ?? true,
        creatorId: dbUser.id,
      },
      include: {
        category: true,
        creator: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await prisma.groupMember.create({
      data: {
        userId: dbUser.id,
        groupId: group.id,
        role: "OWNER",
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Groups POST error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
