"use client";

import { Map, MapControls, MapMarker, MarkerPopup } from "@/components/ui/map";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { Group } from "@/types";

interface GroupMapProps {
  groups: Group[];
  center?: [number, number];
  zoom?: number;
  onGroupClick?: (group: Group) => void;
  selectedGroupId?: string | null;
  className?: string;
}

export function GroupMap({
  groups,
  center = [-74.006, 40.7128],
  zoom = 11,
  onGroupClick,
  selectedGroupId,
  className,
}: GroupMapProps) {
  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      <Map center={center} zoom={zoom} className="h-full w-full">
        <MapControls />
        {groups.map((group) => (
          <MapMarker
            key={group.id}
            longitude={group.longitude}
            latitude={group.latitude}
            onClick={() => onGroupClick?.(group)}
          >
            <MarkerPopup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm">{group.name}</h3>
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
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={group.creator.avatarUrl || undefined} />
                    <AvatarFallback>
                      {group.creator.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{group.creator.name || "Unknown"}</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {group._count.members}
                  </span>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </Card>
  );
}
