import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: dbUser.id, groupId } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already a member" },
        { status: 400 }
      );
    }

    const membership = await prisma.groupMember.create({
      data: {
        userId: dbUser.id,
        groupId,
        role: "MEMBER",
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        group: { select: { name: true } },
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json(
      { error: "Failed to join group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: dbUser.id, groupId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member" },
        { status: 400 }
      );
    }

    if (membership.role === "OWNER") {
      return NextResponse.json(
        { error: "Owner cannot leave group" },
        { status: 400 }
      );
    }

    await prisma.groupMember.delete({
      where: { userId_groupId: { userId: dbUser.id, groupId } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave group error:", error);
    return NextResponse.json(
      { error: "Failed to leave group" },
      { status: 500 }
    );
  }
}
