"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, MapPin } from "lucide-react";
import type { Group } from "@/types";

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  isMember?: boolean;
  isLoading?: boolean;
}

export function GroupCard({ group, onJoin, isMember, isLoading }: GroupCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/groups/${group.slug}`} className="hover:underline">
              <h3 className="font-semibold truncate">{group.name}</h3>
            </Link>
            <Badge
              variant="secondary"
              className="mt-1 text-xs"
              style={{
                backgroundColor: group.category.color || "#6366f1",
                color: "white",
              }}
            >
              {group.category.name}
            </Badge>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={group.creator.avatarUrl || undefined} />
            <AvatarFallback>
              {group.creator.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {group.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {group.description}
          </p>
        )}
        {group.address && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{group.address}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group._count.members} members</span>
        </div>
        {onJoin && !isMember && (
          <Button size="sm" onClick={() => onJoin(group.id)} disabled={isLoading}>
            Join
          </Button>
        )}
        {isMember && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Member
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
