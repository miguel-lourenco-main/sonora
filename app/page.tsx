import type { Metadata } from "next";
import { AudiobookCard } from "./_components/custom/audiobook-card";
import { bookData } from "~/lib/data/sample-story";


export const metadata: Metadata = {
  title: "Select Story",
};

export default function HomePage() {
  const stories = bookData.slice(0, 10)
  return (
    <div className="px-6 py-10 font-oregano">
      <div className="mx-auto max-w-[80%]">
        <h1 className="mb-6 text-center text-5xl font-semibold tracking-tight py-12">Choose Your Story</h1>
        <div className="relative grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-12 place-items-center">
          {stories.map((story) => (
            <AudiobookCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  )
}