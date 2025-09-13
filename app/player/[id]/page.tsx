// Server i18n removed for static export
import { AudioAvailabilityChecker } from '../../_components/custom/audio-availability-checker';
import { bookData } from '~/lib/data/sample-story';

export const metadata = { title: 'Story Player' };

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return bookData.map((b) => ({ id: b.id }));
}

async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  // Validate that the ID is a valid number between 1-10
  const numericId = parseInt(id);
  if (isNaN(numericId) || numericId < 1 || numericId > 10) {
    return <div>Book not found</div>;
  }

  // Map audiobook ID to story index (audiobook IDs are 1-10, story indices are 0-9)
  const storyIndex = numericId - 1;
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