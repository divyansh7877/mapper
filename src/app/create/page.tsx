"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LocationPicker } from "@/components/location-picker";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    latitude: 0,
    longitude: 0,
    address: "",
    isPublic: true,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserLocation(loc);
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        () => {
          const defaultLoc: [number, number] = [-74.006, 40.7128];
          setUserLocation(defaultLoc);
          setFormData((prev) => ({
            ...prev,
            latitude: 40.7128,
            longitude: -74.006,
          }));
        }
      );
    }
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const group = await res.json();
        toast.success("Group created successfully!");
        router.push(`/groups/${group.slug}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create group.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a Group</h1>
        <p className="text-muted-foreground mt-2">
          Start a community around your interests and location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Brooklyn Hikers"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell people what your group is about..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value || "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor="isPublic">Public group (visible to everyone)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="123 Main St, Brooklyn, NY"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="h-[300px] rounded-lg overflow-hidden border">
              <LocationPicker
                center={userLocation || [-74.006, 40.7128]}
                zoom={13}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-2 bg-muted rounded">
                <span className="text-muted-foreground">Latitude: </span>
                <span className="font-mono">{formData.latitude.toFixed(6)}</span>
              </div>
              <div className="p-2 bg-muted rounded">
                <span className="text-muted-foreground">Longitude: </span>
                <span className="font-mono">{formData.longitude.toFixed(6)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
}
