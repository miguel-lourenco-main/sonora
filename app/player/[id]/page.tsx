// Server i18n removed for static export
import { AudioAvailabilityChecker } from '../../_components/custom/audio-availability-checker';
import { bookData } from '~/lib/data/sample-story';

export const metadata = { title: 'Story Player' };

export function generateStaticParams() {
  return bookData.map((b) => ({ id: b.id }));
}

function PlayerPage({ params }: { params: { id: string } }) {
  const { id } = params;

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

export default PlayerPage;