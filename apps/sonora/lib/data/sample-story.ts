import { Story } from "~/lib/types";
import { wordTimings } from "./word-timings";

console.log('wordTimings', wordTimings);
console.log('wordTimings["shadow-path"]', wordTimings["shadow-path"]);

export const bookData: Story[] = [
  {
    id: "1",
    title: "The Enchanted Forest: An Interactive Tale",
    label: "enchanted-forest",
    author: "A. I. Storyteller",
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9wm1QiJmXT9Rqir1ZnZTk7GBifUnsv.png",
    chapters: [
      {
        number: 1,
        title: "The Mysterious Path",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Deep within the realm of ancient magic lies the Enchanted Forest, a place where every choice shapes destiny. As you step through the ethereal mist that marks its borders, you feel the forest's consciousness stirring. The very air seems alive with whispers of untold stories, and the path before you pulses with magical energy. Your journey into these mystical woods begins now.",
              nextNodeId: "path-split",
              wordTimings: wordTimings.start,
              voiceId: 'default',
              //audioUrl: "/samples/enchanted-forest-start.mp3",
            },
            "path-split": {
              id: "path-split",
              text: "The forest path divides before you. To your left, shadows dance invitingly beneath ancient boughs. To your right, golden sunlight streams through a canopy of emerald leaves.",
              choices: [
                { text: "Take the shadowy path", nextNodeId: "shadow-path" },
                { text: "Choose the sunlit path", nextNodeId: "sun-path" }
              ],
              wordTimings: wordTimings["path-split"],
              voiceId: 'default',
              //audioUrl: "/samples/enchanted-forest-path-split.mp3",
            },
            "shadow-path": {
              id: "shadow-path",
              text: "You venture down the shadowy path, where ancient moss-covered trees loom overhead like silent guardians. The air grows thick with mystery as you navigate through twisted roots and hear distant echoes of forgotten magic. Strange glowing mushrooms illuminate your way, casting an otherworldly blue light that dances across your path. The whispers of the forest grow stronger here, speaking of secrets long buried in these dark depths. As you press forward, you can't shake the feeling that unseen eyes are watching your every move, judging your worthiness to witness the forest's deepest mysteries.",
              wordTimings: wordTimings["shadow-path"],
              nextNodeId: "end-chapter",
              voiceId: 'default',
              //audioUrl: "/samples/enchanted-forest-shadow-path.mp3",
            },
            "sun-path": {
              id: "sun-path",
              text: "The sunlit path welcomes you with a warm embrace as golden rays filter through the swaying branches above. Butterflies with wings like stained glass dance around wildflowers that carpet the forest floor in a riot of colors. As you walk, you discover small clearings where magical creatures go about their daily lives - pixies tending to luminous flowers, and small forest spirits playing among the roots of ancient trees. The air here is sweet with the scent of blooming magic, though beneath this cheerful facade, you sense powerful forces at work, weaving spells as old as the forest itself.",
              wordTimings: wordTimings["sun-path"],
              nextNodeId: "end-chapter",
              voiceId: 'default',
              //audioUrl: "/samples/enchanted-forest-sun-path.mp3",
            },
            "end-chapter": {
              id: "end-chapter",
              text: "Your choice has set in motion events that will echo through the Enchanted Forest. But this is just the beginning of your magical journey.",
              wordTimings: wordTimings["end-chapter"],
              voiceId: 'default',
              //audioUrl: "/samples/enchanted-forest-end-chapter.mp3",
            }
          }
        }
      },
    ],
    currentChapter: 1,
    totalChapters: 5
  },
  {
    id: "2",
    title: "The Mystic Mountain: A Journey of Choices",
    label: "mystic-mountain",
    author: "Digital Wordsmith",
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9wm1QiJmXT9Rqir1ZnZTk7GBifUnsv.png",
    chapters: [
      {
        number: 1,
        title: "The Mountain's Call",
        content: {
          initialNodeId: "start",
          nodes: {
            start: {
              id: "start",
              text: "Before you stands the legendary Mystic Mountain, its snow-capped peaks piercing the clouds like ancient spears thrust into the heavens. Swirling mists dance around its middle reaches, hiding secrets that have drawn seekers and mystics for countless generations. The mountain's presence feels alive, almost sentient, as if it's evaluating your worthiness to climb its sacred slopes. Local legends speak of powerful artifacts and ancient wisdom hidden within its depths, but also of those who ventured forth and never returned. As you stand at its base, the mountain's energy pulses through the ground beneath your feet, calling you to begin your ascent.",
              nextNodeId: "mountain_base",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-start.mp3",
            },
            mountain_base: {
              id: "mountain_base",
              text: "Two paths lie before you: ancient stone steps worn smooth by countless pilgrims, and a misty mountain trail that winds into the swirling fog. Each promises its own challenges and revelations.",
              choices: [
                { text: "Follow the ancient stone steps", nextNodeId: "stone_steps" },
                { text: "Take the misty mountain trail", nextNodeId: "misty_trail" }
              ],
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-mountain_base.mp3",
            },
            stone_steps: {
              id: "stone_steps",
              text: "You choose the ancient stone steps. Each one bears intricate carvings that glow faintly at your touch, pulsing with the wisdom of ages. The higher you climb, the more you feel the mountain's ancient power flowing through the very stone beneath your feet.",
              nextNodeId: "mountain_sage",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-stone_steps.mp3",
            },
            misty_trail: {
              id: "misty_trail",
              text: "The misty trail embraces you in its ethereal veil. Shapes and shadows dance in the fog around you, and the path seems to shift with each step. Yet somehow, you sense you're being guided toward something significant.",
              nextNodeId: "crystal_cave",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-misty_trail.mp3",
            },
            mountain_sage: {
              id: "mountain_sage",
              text: "In a small alcove carved into the mountainside, you encounter an elderly sage. His white robes seem to shimmer with their own inner light, and his eyes hold the depth of centuries. Ancient scrolls and crystalline artifacts surround him, each one pulsing with mysterious energy. As he turns his knowing gaze upon you, you sense that this meeting is no coincidence.",
              nextNodeId: "sage_quest",             
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-mountain_sage.mp3",
            },
            crystal_cave: {
              id: "crystal_cave",
              text: "The cave entrance sparkles with embedded crystals of every color imaginable, each one pulsing with its own rhythm of light. The air here feels charged with ancient power, and the crystals seem to sing a haunting melody that resonates deep within your soul. As you step inside, the crystals' light intensifies, revealing patterns and symbols etched into the walls that seem to shift and change as you watch.",
              nextNodeId: "cave_discovery",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-crystal_cave.mp3",
            },
            sage_quest: {
              id: "sage_quest",
              text: "The mountain sage speaks in a voice that echoes with the weight of ages: 'The sacred crystal you seek is both blessing and burden, young seeker. It maintains the delicate balance of energies that keep this mountain, and the lands beyond, in harmony. But dark forces gather, seeking to harness its power for their own ends. The choice before you is greater than you know - will you take up this burden, knowing the dangers that come with it? Or do you wish to learn more of what awaits on this treacherous path?' His eyes pierce into yours, waiting for your response.",
              choices: [
                { text: "Accept the quest for the sacred crystal", nextNodeId: "accept_mission" },
                { text: "Request more details about the journey", nextNodeId: "seek_wisdom" }
              ],
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-sage_quest.mp3",
            },
            cave_discovery: {
              id: "cave_discovery",
              text: "Deep within the crystal cave, you find yourself in a vast chamber that takes your breath away. Massive crystal formations reach from floor to ceiling like frozen waterfalls of light, each one thrumming with ancient power. On one side, a particular cluster of crystals pulses with an almost hypnotic rhythm, their light dancing in patterns that seem to tell a story. On the other, the cave walls are covered in intricate paintings that seem to move in the crystalline light - depicting the mountain's history and perhaps its future. The air is thick with magic, and you can feel the weight of your next choice pressing upon you.",
              choices: [
                { text: "Explore the glowing crystal formations", nextNodeId: "crystal_path" },
                { text: "Study the ancient cave paintings", nextNodeId: "painting_study" }
              ],
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-cave_discovery.mp3",
            },
            accept_mission: {
              id: "accept_mission",
              text: "With unwavering resolve, you accept the sacred duty. The sage's eyes gleam with approval as he guides you toward the summit path.",
              nextNodeId: "summit_path",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-accept_mission.mp3",
            },
            seek_wisdom: {
              id: "seek_wisdom",
              text: "You choose to seek deeper understanding. The sage nods approvingly and shares ancient secrets that will guide your journey to the summit.",
              nextNodeId: "summit_path",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-seek_wisdom.mp3",
            },
            crystal_path: {
              id: "crystal_path",
              text: "Following the crystal's pulsing light, you navigate deeper into the mountain's heart, each step illuminated by their ethereal glow.",
              nextNodeId: "sacred_chamber",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-crystal_path.mp3",
            },
            painting_study: {
              id: "painting_study",
              text: "The ancient paintings reveal a story of balance and power, guiding you toward the mountain's sacred chamber with newfound understanding.",
              nextNodeId: "sacred_chamber",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-painting_study.mp3",
            },
            summit_path: {
              id: "summit_path",
              text: "The path to the summit narrows, with swirling mists below and the crystal's power growing stronger above.",
              nextNodeId: "final_choice",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-summit_path.mp3",
            },
            sacred_chamber: {
              id: "sacred_chamber",
              text: "You enter the sacred chamber, where the very air thrums with power. The final choice lies before you.",
              nextNodeId: "final_choice",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-sacred_chamber.mp3",
            },
            final_choice: {
              id: "final_choice",
              text: "The sacred crystal hovers before you, its power palpable. Will you become its guardian, or trust in the mountain's ancient balance?",
              choices: [
                { text: "Take the crystal to protect the mountain", nextNodeId: "protect_mountain" },
                { text: "Leave the crystal to maintain balance", nextNodeId: "maintain_balance" }
              ],
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-final_choice.mp3",
            },
            protect_mountain: {
              id: "protect_mountain",
              text: "Taking the crystal, you accept your role as the mountain's new guardian. Its power flows through you, binding your fate to these sacred peaks.",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-protect_mountain.mp3",
            },
            maintain_balance: {
              id: "maintain_balance",
              text: "You step back, choosing to maintain the ancient balance. The crystal pulses once, as if acknowledging your wisdom.",
              voiceId: 'default',
              //audioUrl: "/samples/mystic-mountain-maintain_balance.mp3",
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 5
  }
]