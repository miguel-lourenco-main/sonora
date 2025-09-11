import { z } from 'zod';

const PathsSchema = z.object({
  app: z.object({
    selectStoryPage: z.string().min(1),
    storyPlayer: z.string().min(1),
    voicesList: z.string().min(1),
  }),
});

const pathsConfig = PathsSchema.parse({
  app: {
    selectStoryPage: '/player',
    storyPlayer: '/player/[id]',
    voicesList: '/voices',
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
