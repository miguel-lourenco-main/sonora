import { ScrollBar } from "@kit/ui/scroll-area";
import { ScrollArea } from "@kit/ui/scroll-area";
import { withI18n } from "~/lib/i18n/with-i18n";
import { AudiobookCard } from "./_components/custom/audiobook-card";
import { Separator } from "@kit/ui/separator";
import { CategoryPills } from "./_components/custom/category-pills";
import { createI18nServerInstance } from "~/lib/i18n/i18n.server";
import { categories, featuredAudiobooks, recommendedAudiobooks } from "~/lib/data/audiobook-data";


export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('custom:routes.selectStoryPage');

  return {
    title,
  };
};

function HomePage() {
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

export default withI18n(HomePage);