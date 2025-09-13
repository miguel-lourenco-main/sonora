import { ScrollBar } from "@kit/ui/shadcn/scroll-area";
import { ScrollArea } from "@kit/ui/shadcn/scroll-area";
import { AudiobookCard } from "./_components/custom/audiobook-card";
import { Separator } from "@kit/ui/shadcn/separator";
import { CategoryPills } from "./_components/custom/category-pills";
import { categories, featuredAudiobooks, recommendedAudiobooks } from "~/lib/data/audiobook-data";


export const generateMetadata = async () => {

  return "Select Story"
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <div className="mb-4">
          <CategoryPills categories={categories} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured Audiobooks
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {featuredAudiobooks.map((audiobook) => (
                <AudiobookCard
                  key={audiobook.id}
                  audiobook={audiobook}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Recommended for You
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on your listening history.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {recommendedAudiobooks.map((audiobook) => (
                <AudiobookCard
                  key={audiobook.id}
                  audiobook={audiobook}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>
    </div>
  )
}