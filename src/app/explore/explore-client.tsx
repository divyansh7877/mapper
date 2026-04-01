"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { GroupMap } from "@/components/group-map";
import { GroupCard } from "@/components/group-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, List, Map, X } from "lucide-react";
import type { Group } from "@/types";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count: { groups: number };
}

export function ExploreClient() {
  const searchParams = useSearchParams();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list" | "split">("split");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [radius, setRadius] = useState(searchParams.get("radius") || "50");
  const [showFilters, setShowFilters] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userLocation) {
        params.set("lat", userLocation[1].toString());
        params.set("lng", userLocation[0].toString());
        params.set("radius", radius);
      }
      if (category && category !== "all") {
        params.set("category", category);
      }
      if (search) {
        params.set("search", search);
      }
      
      const res = await fetch(`/api/groups?${params}`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  }, [userLocation, category, search, radius]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        () => {
          setUserLocation([-74.006, 40.7128]);
        }
      );
    } else {
      setUserLocation([-74.006, 40.7128]);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchGroups();
    }
  }, [userLocation, fetchGroups]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGroups();
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
      if (res.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setRadius("50");
  };

  const hasFilters = search || (category && category !== "all") || radius !== "50";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-14 z-10">
        <div className="container py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>Filters</SheetTitle>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={(v) => setCategory(v || "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name} ({cat._count.groups})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Radius: {radius} km
                    </label>
                    <Input
                      type="range"
                      min="5"
                      max="200"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                    />
                  </div>
                  {hasFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Clear filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "split" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("split")}
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("map")}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit">Search</Button>
          </form>
          {hasFilters && (
            <div className="flex gap-2 flex-wrap">
              {category && category !== "all" && (
                <Badge variant="secondary">
                  {categories.find((c) => c.slug === category)?.name}
                </Badge>
              )}
              {radius !== "50" && <Badge variant="secondary">{radius}km</Badge>}
              {search && <Badge variant="secondary">"{search}"</Badge>}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 container py-4">
        {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading groups...
              </div>
            ) : groups.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No groups found. Try adjusting your filters.
              </div>
            ) : (
              groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                />
              ))
            )}
          </div>
        )}

        {viewMode === "map" && userLocation && (
          <GroupMap
            groups={groups}
            center={userLocation}
            zoom={12}
            onGroupClick={setSelectedGroup}
            selectedGroupId={selectedGroup?.id}
            className="h-full"
          />
        )}

        {viewMode === "split" && userLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading groups...
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No groups found. Try adjusting your filters.
                </div>
              ) : (
                groups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onJoin={handleJoinGroup}
                    isMember={selectedGroup?.id === group.id}
                  />
                ))
              )}
            </div>
            <GroupMap
              groups={groups}
              center={userLocation}
              zoom={12}
              onGroupClick={setSelectedGroup}
              selectedGroupId={selectedGroup?.id}
              className="h-[calc(100vh-12rem)]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
