import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
import { AudioAvailabilityChecker } from '../../_components/custom/audio-availability-checker';
import { bookData } from '~/lib/data/sample-story';

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

  // Map audiobook ID to story index (audiobook IDs are 1-10, story indices are 0-9)
  const storyIndex = parseInt(id) - 1;
  const selectedBook = bookData[storyIndex];
  
  if (!selectedBook) {
    return <div>Book not found</div>;
  }

  return (
    <AudioAvailabilityChecker 
      story={selectedBook} 
      initialVoiceId={undefined}
    />
  );
}

export default withI18n(PlayerPage);