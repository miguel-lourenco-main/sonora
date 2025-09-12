import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
import { StoryPlayer } from '../../_components/custom/book-player';
import { bookData } from '~/lib/data/sample-story';
import { listVoices } from '~/lib/client/elevenlabs';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('custom:routes.storyPlayer');

  return {
    title,
  };
};

async function PlayerPage({ params }: { params: { id: string } }) {

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { id } = await params;

  const selectedBook = bookData[parseInt(id) % 2];
  
  if (!selectedBook) {
    return <div>Book not found</div>;
  }

  // No SSR voice fetch; the client will handle voices

  return (
    <StoryPlayer 
      story={selectedBook} 
      initialVoiceId={undefined}
    />
  );
}

export default withI18n(PlayerPage);