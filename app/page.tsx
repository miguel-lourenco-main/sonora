import type { Metadata } from "next";

// Static catalog entry; player routes are pre-rendered from the same `bookData` slice.

import { CatalogPageClient } from "./_components/catalog-page-client";
import { bookData } from "~/lib/data/sample-story";

export const metadata: Metadata = {
  title: "Choose Your Story",
};

export default function HomePage() {
  const stories = bookData.slice(0, 10);

  return <CatalogPageClient stories={stories} />;
}
