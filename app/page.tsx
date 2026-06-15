import type { Metadata } from "next";
import { LandingPage } from "./_components/landing/landing-page";
import { bookData } from "~/lib/data/sample-story";

export const metadata: Metadata = {
  title: "Sonora — Interactive AI Audiobooks",
};

export default function HomePage() {
  const stories = bookData.slice(0, 10);

  return <LandingPage stories={stories} />;
}
