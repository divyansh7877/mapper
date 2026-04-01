import { Suspense } from "react";
import { ExploreClient } from "./explore-client";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ExploreClient />
    </Suspense>
  );
}
