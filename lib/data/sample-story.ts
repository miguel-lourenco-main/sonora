import { Story } from "~/lib/types";
import { wordTimings } from "./word-timings";

export const bookData: Story[] = [
  {
    id: "1",
    title: "The Enchanted Forest: An Interactive Tale",
    label: "enchanted-forest",
    author: "A. I. Storyteller",
    coverUrl: "/images/enchanted_forest.jpg",
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
    coverUrl: "/images/mystic_mountain.jpg",
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
  },
  {
    id: "3",
    title: "The Midnight Library",
    label: "midnight-library",
    author: "Matt Haig",
    coverUrl: "/images/midnight_library.jpg",
    chapters: [
      {
        number: 1,
        title: "The Library Between Life and Death",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
              nextNodeId: "library-intro",
              voiceId: 'default',
            },
            "library-intro": {
              id: "library-intro",
              text: "Nora Seed stands before the infinite shelves of the Midnight Library, each book representing a different version of her life. The librarian, Mrs. Elm, explains that Nora can try as many lives as she wants until she finds the one that makes her want to stay. But time is running out, and with each life she tries, the library begins to fade.",
              choices: [
                { text: "Try the life where she became a glaciologist", nextNodeId: "glaciologist-life" },
                { text: "Try the life where she stayed with her fiancé", nextNodeId: "fiance-life" },
                { text: "Try the life where she became a rock star", nextNodeId: "rockstar-life" }
              ],
              voiceId: 'default',
            },
            "glaciologist-life": {
              id: "glaciologist-life",
              text: "In this life, Nora became a glaciologist and is now in the Arctic, studying climate change. She feels fulfilled by her work but isolated from human connection. The ice around her is melting faster than ever, and she realizes that even in this 'perfect' life, there are still challenges and regrets.",
              nextNodeId: "life-reflection",
              voiceId: 'default',
            },
            "fiance-life": {
              id: "fiance-life",
              text: "In this life, Nora married her fiancé Dan and they have children together. She's a stay-at-home mother, but feels trapped and unfulfilled. The relationship has grown stale, and she realizes that the grass isn't always greener on the other side.",
              nextNodeId: "life-reflection",
              voiceId: 'default',
            },
            "rockstar-life": {
              id: "rockstar-life",
              text: "In this life, Nora became a famous rock star with her band. She's living the dream with fame, fortune, and adoring fans. But the pressure is overwhelming, and she's struggling with addiction and the loss of her authentic self.",
              nextNodeId: "life-reflection",
              voiceId: 'default',
            },
            "life-reflection": {
              id: "life-reflection",
              text: "After experiencing different versions of her life, Nora begins to understand that no life is perfect. Each choice comes with its own set of challenges and rewards. The library starts to fade as she realizes that the life she wants to live is the one where she can make peace with her regrets and find meaning in the present moment.",
              nextNodeId: "final-choice",
              voiceId: 'default',
            },
            "final-choice": {
              id: "final-choice",
              text: "The Midnight Library is disappearing around her. Mrs. Elm appears one last time and asks: 'What do you want to do with your life?' Nora must decide whether to return to her original life with new understanding, or try one more different path.",
              choices: [
                { text: "Return to my original life with new perspective", nextNodeId: "return-home" },
                { text: "Try one more life - the one where I became a philosophy professor", nextNodeId: "philosophy-life" }
              ],
              voiceId: 'default',
            },
            "philosophy-life": {
              id: "philosophy-life",
              text: "In this final life, Nora is a philosophy professor, helping students explore the meaning of existence. She's found her calling in teaching others about life's big questions. But even here, she realizes that fulfillment comes not from the perfect life, but from accepting and making the most of whatever life you have.",
              nextNodeId: "return-home",
              voiceId: 'default',
            },
            "return-home": {
              id: "return-home",
              text: "Nora wakes up in her original life, but now she sees it with fresh eyes. She understands that every life has value, and that the key to happiness isn't finding the perfect life, but learning to appreciate the life you have. She decides to start living with intention, making choices that align with her values, and finding joy in the small moments that make life worth living.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "4",
    title: "The Clockwork Kingdom: A Tale of Transformation",
    label: "clockwork-kingdom",
    author: "Luna Mechanica",
    coverUrl: "/images/clockwork_kingdom.png",
    chapters: [
      {
        number: 1,
        title: "The Mechanical Heart",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "In the heart of the Clockwork Kingdom, where brass towers reach toward copper skies and golden gears turn the very fabric of time, a young apprentice named Zara discovers that her world is not what it seems. The kingdom's mechanical heart, which has kept the realm in perfect harmony for centuries, is beginning to falter. As the gears slow and the clockwork creatures grow restless, Zara must embark on a journey to restore the kingdom's balance before it collapses into chaos.",
              nextNodeId: "mechanical-heart",
              voiceId: 'default',
            },
            "mechanical-heart": {
              id: "mechanical-heart",
              text: "Zara stands before the Great Mechanical Heart, a massive brass and copper contraption that pulses with golden light. The heart's rhythm has become irregular, and strange shadows dance within its gears. The Master Clockmaker, an ancient automaton with eyes like polished gems, explains that the heart requires three sacred components to function properly: the Gear of Time, the Spring of Harmony, and the Key of Transformation. Each component is hidden in a different realm of the kingdom, and Zara must choose which path to take first.",
              choices: [
                { text: "Seek the Gear of Time in the Temporal Gardens", nextNodeId: "temporal-gardens" },
                { text: "Find the Spring of Harmony in the Melodic Caverns", nextNodeId: "melodic-caverns" },
                { text: "Search for the Key of Transformation in the Alchemical Tower", nextNodeId: "alchemical-tower" }
              ],
              voiceId: 'default',
            },
            "temporal-gardens": {
              id: "temporal-gardens",
              text: "Zara enters the Temporal Gardens, where time flows differently in each section. Clockwork flowers bloom and wither in rapid cycles, while mechanical butterflies flutter between past and future. The Gear of Time is guarded by the Chronos Guardian, a massive clockwork dragon that can manipulate time itself. To reach the gear, Zara must solve temporal puzzles and navigate through shifting timelines.",
              nextNodeId: "chronos-challenge",
              voiceId: 'default',
            },
            "melodic-caverns": {
              id: "melodic-caverns",
              text: "Deep in the Melodic Caverns, Zara discovers a world where sound has physical form. Musical notes float through the air like glowing butterflies, and the walls themselves sing ancient melodies. The Spring of Harmony is protected by the Symphony Keeper, an ethereal being made of pure sound. To obtain the spring, Zara must compose a harmony that resonates with the cavern's natural frequencies.",
              nextNodeId: "symphony-challenge",
              voiceId: 'default',
            },
            "alchemical-tower": {
              id: "alchemical-tower",
              text: "The Alchemical Tower rises impossibly high, its walls covered in glowing runes that shift and change. Inside, Zara finds a laboratory where the very laws of physics seem malleable. The Key of Transformation is held by the Alchemist Prime, a mysterious figure who can transmute matter itself. To earn the key, Zara must prove her understanding of the fundamental principles of change and transformation.",
              nextNodeId: "alchemy-challenge",
              voiceId: 'default',
            },
            "chronos-challenge": {
              id: "chronos-challenge",
              text: "The Chronos Guardian presents Zara with a temporal puzzle: she must navigate through three different time periods simultaneously, collecting fragments of the Gear of Time from past, present, and future. Each fragment requires her to understand how small changes in one era can create massive transformations in another. As she solves the puzzle, she learns that transformation is not about sudden change, but about the accumulation of small, consistent actions over time.",
              nextNodeId: "gear-obtained",
              voiceId: 'default',
            },
            "symphony-challenge": {
              id: "symphony-challenge",
              text: "The Symphony Keeper challenges Zara to create a harmony that represents the balance between order and chaos, tradition and innovation. She must blend the ancient melodies of the cavern with new, creative compositions. As she experiments with different combinations, she discovers that true harmony comes from understanding how different elements can work together to create something greater than the sum of their parts.",
              nextNodeId: "spring-obtained",
              voiceId: 'default',
            },
            "alchemy-challenge": {
              id: "alchemy-challenge",
              text: "The Alchemist Prime tests Zara's understanding of transformation by asking her to transmute a simple brass gear into something more complex. She must demonstrate that she understands the fundamental principles: that change requires energy, that transformation is a process, and that the end result depends on the quality of the process. Through this challenge, she learns that personal transformation follows the same principles as alchemical transmutation.",
              nextNodeId: "key-obtained",
              voiceId: 'default',
            },
            "gear-obtained": {
              id: "gear-obtained",
              text: "With the Gear of Time in her possession, Zara feels the weight of temporal responsibility. The gear pulses with golden energy, and she can sense how her actions ripple through time. She realizes that every choice she makes creates echoes in the past and future, and that true transformation requires understanding the interconnected nature of all things.",
              nextNodeId: "final-assembly",
              voiceId: 'default',
            },
            "spring-obtained": {
              id: "spring-obtained",
              text: "The Spring of Harmony flows with liquid music, its waters singing with the voices of all the melodies that have ever been created. As Zara collects it, she feels a deep sense of balance and peace. She understands that harmony is not about eliminating conflict, but about finding the right balance between different forces and perspectives.",
              nextNodeId: "final-assembly",
              voiceId: 'default',
            },
            "key-obtained": {
              id: "key-obtained",
              text: "The Key of Transformation is a living thing, constantly shifting between different forms and materials. As Zara holds it, she feels her own potential for change and growth. The key teaches her that transformation is not a destination, but a continuous process of becoming the best version of oneself.",
              nextNodeId: "final-assembly",
              voiceId: 'default',
            },
            "final-assembly": {
              id: "final-assembly",
              text: "Returning to the Great Mechanical Heart, Zara carefully installs the three sacred components. As each piece falls into place, the heart begins to beat with renewed vigor. The kingdom's clockwork creatures dance with joy, and the brass towers gleam with golden light. Zara realizes that her journey was not just about saving the kingdom, but about her own transformation from apprentice to master. She has learned that true change comes from understanding the interconnected nature of all things and the power of small, consistent actions.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "5",
    title: "Project Hail Mary",
    label: "project-hail-mary",
    author: "Andy Weir",
    coverUrl: "/images/project_hail_mary.jpg",
    chapters: [
      {
        number: 1,
        title: "The Last Hope",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Ryland Grace is the sole survivor on a desperate, last-chance mission. If he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time.",
              nextNodeId: "awakening",
              voiceId: 'default',
            },
            "awakening": {
              id: "awakening",
              text: "Grace slowly regains consciousness in a small spacecraft, surrounded by the bodies of his crewmates. As his memory returns in fragments, he realizes he's on a mission to save Earth from an extinction-level event. The sun is being dimmed by an alien organism, and he's humanity's last hope.",
              choices: [
                { text: "Investigate the alien organism", nextNodeId: "alien-investigation" },
                { text: "Try to contact Earth", nextNodeId: "earth-contact" },
                { text: "Examine the ship's systems", nextNodeId: "ship-systems" }
              ],
              voiceId: 'default',
            },
            "alien-investigation": {
              id: "alien-investigation",
              text: "Grace discovers that the alien organism, which he calls 'Astrophage,' is not just dimming the sun - it's consuming stellar energy across the galaxy. He realizes that this is a galactic crisis, not just an Earth problem. The organism reproduces exponentially and could eventually consume all stars.",
              nextNodeId: "rocky-encounter",
              voiceId: 'default',
            },
            "earth-contact": {
              id: "earth-contact",
              text: "Grace attempts to contact Earth but discovers that communication is impossible due to the distance and the Astrophage interference. He's truly alone in this mission, with no backup or guidance from home. He must rely entirely on his scientific knowledge and problem-solving skills.",
              nextNodeId: "rocky-encounter",
              voiceId: 'default',
            },
            "ship-systems": {
              id: "ship-systems",
              text: "Grace examines the ship's systems and discovers that the mission was designed to find a solution to the Astrophage problem. The ship is equipped with advanced scientific instruments and a sample of the organism. He realizes he needs to understand how to stop or reverse the Astrophage's effects.",
              nextNodeId: "rocky-encounter",
              voiceId: 'default',
            },
            "rocky-encounter": {
              id: "rocky-encounter",
              text: "Grace encounters an alien spacecraft piloted by a spider-like being he names 'Rocky.' Despite the language barrier, they begin to communicate through mathematics and music. Rocky is also on a mission to save his planet from the Astrophage, and they realize they must work together.",
              choices: [
                { text: "Share scientific knowledge with Rocky", nextNodeId: "scientific-collaboration" },
                { text: "Learn about Rocky's planet and culture", nextNodeId: "cultural-exchange" },
                { text: "Focus on finding a solution together", nextNodeId: "solution-focus" }
              ],
              voiceId: 'default',
            },
            "scientific-collaboration": {
              id: "scientific-collaboration",
              text: "Grace and Rocky begin sharing their scientific knowledge. They discover that their approaches to the Astrophage problem are complementary. Rocky's species has different technology and understanding of physics that could be crucial to finding a solution.",
              nextNodeId: "breakthrough",
              voiceId: 'default',
            },
            "cultural-exchange": {
              id: "cultural-exchange",
              text: "Through their communication, Grace learns about Rocky's planet and culture. Rocky's species lives in a high-pressure, high-temperature environment and has developed technology that works in conditions that would be impossible for humans. This cultural understanding helps them work together more effectively.",
              nextNodeId: "breakthrough",
              voiceId: 'default',
            },
            "solution-focus": {
              id: "solution-focus",
              text: "Grace and Rocky focus on finding a solution to the Astrophage problem. They combine their knowledge and resources to develop a plan. They realize that they need to find a way to make the Astrophage self-destruct or become harmless to stars.",
              nextNodeId: "breakthrough",
              voiceId: 'default',
            },
            "breakthrough": {
              id: "breakthrough",
              text: "Working together, Grace and Rocky make a breakthrough. They discover that the Astrophage can be modified to become harmless to stars while still maintaining its energy-storage properties. They develop a solution that could save both their planets and potentially the entire galaxy.",
              nextNodeId: "final-mission",
              voiceId: 'default',
            },
            "final-mission": {
              id: "final-mission",
              text: "Grace and Rocky must now implement their solution. They face the challenge of deploying the modified Astrophage across the galaxy to reverse the damage. The mission is dangerous and uncertain, but it's the only hope for their civilizations and countless others.",
              choices: [
                { text: "Proceed with the risky mission", nextNodeId: "mission-success" },
                { text: "Try to find a safer alternative", nextNodeId: "alternative-solution" }
              ],
              voiceId: 'default',
            },
            "mission-success": {
              id: "mission-success",
              text: "Grace and Rocky successfully implement their solution. The modified Astrophage begins to reverse the damage to stars across the galaxy. Their planets are saved, and they've prevented a galactic catastrophe. Grace realizes that cooperation and friendship across species boundaries was the key to success.",
              voiceId: 'default',
            },
            "alternative-solution": {
              id: "alternative-solution",
              text: "Grace and Rocky work together to find a safer alternative. They develop a more controlled approach that minimizes risk while still achieving their goal. Through careful planning and mutual trust, they successfully save their planets and prevent the galactic crisis.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "6",
    title: "Greenlights",
    label: "greenlights",
    author: "Matthew McConaughey",
    coverUrl: "/images/greenlights.jpg",
    chapters: [
      {
        number: 1,
        title: "The Art of Living",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Life is a series of green lights. Sometimes you get them, sometimes you don't. But the key is to keep moving forward, to keep looking for the next green light. This is the story of how I learned to navigate life's traffic lights, to find the green lights even when they seemed red, and to create my own green lights when none were given.",
              nextNodeId: "early-life",
              voiceId: 'default',
            },
            "early-life": {
              id: "early-life",
              text: "Growing up in Texas, I learned early that life doesn't always go according to plan. My parents had a tumultuous relationship, and I often found myself caught in the middle. But I also learned that every challenge is an opportunity to grow, to become stronger, to find your own way.",
              choices: [
                { text: "Learn about his family dynamics", nextNodeId: "family-dynamics" },
                { text: "Explore his early career choices", nextNodeId: "early-career" },
                { text: "Discover his philosophy on challenges", nextNodeId: "challenge-philosophy" }
              ],
              voiceId: 'default',
            },
            "family-dynamics": {
              id: "family-dynamics",
              text: "My parents' relationship taught me about love, conflict, and the complexity of human relationships. They loved each other deeply but couldn't live together peacefully. This taught me that love isn't always enough - you need compatibility, communication, and the willingness to work through difficulties.",
              nextNodeId: "life-lessons",
              voiceId: 'default',
            },
            "early-career": {
              id: "early-career",
              text: "I started in advertising before moving to acting. Each career change was a leap of faith, a decision to follow my instincts rather than the safe path. I learned that sometimes you have to create your own opportunities, to make your own green lights when the world seems to be showing you red ones.",
              nextNodeId: "life-lessons",
              voiceId: 'default',
            },
            "challenge-philosophy": {
              id: "challenge-philosophy",
              text: "I believe that challenges are not obstacles but opportunities. Every red light is a chance to pause, reflect, and prepare for the next green light. The key is to stay positive, to keep moving forward, and to trust that the right opportunities will present themselves at the right time.",
              nextNodeId: "life-lessons",
              voiceId: 'default',
            },
            "life-lessons": {
              id: "life-lessons",
              text: "Through my journey, I've learned several key principles: First, be authentic to yourself. Second, embrace the journey, not just the destination. Third, find joy in the process. Fourth, be grateful for what you have. And fifth, always be ready for the next green light.",
              nextNodeId: "acting-career",
              voiceId: 'default',
            },
            "acting-career": {
              id: "acting-career",
              text: "My acting career has been a series of green lights and red lights. Some roles came easily, others required years of persistence. I learned that success in Hollywood isn't just about talent - it's about timing, relationships, and the willingness to take risks and try new things.",
              choices: [
                { text: "Learn about his breakthrough roles", nextNodeId: "breakthrough-roles" },
                { text: "Explore his approach to character development", nextNodeId: "character-development" },
                { text: "Discover his philosophy on fame", nextNodeId: "fame-philosophy" }
              ],
              voiceId: 'default',
            },
            "breakthrough-roles": {
              id: "breakthrough-roles",
              text: "Roles like 'Dazed and Confused' and 'The Lincoln Lawyer' were turning points in my career. Each role taught me something new about acting and about myself. I learned that the best performances come from understanding the character's motivations and finding the truth in their story.",
              nextNodeId: "personal-growth",
              voiceId: 'default',
            },
            "character-development": {
              id: "character-development",
              text: "I approach each character as a real person with their own history, motivations, and flaws. I try to understand what drives them, what they're afraid of, and what they're fighting for. This approach has helped me create more authentic and compelling performances.",
              nextNodeId: "personal-growth",
              voiceId: 'default',
            },
            "fame-philosophy": {
              id: "fame-philosophy",
              text: "Fame is a double-edged sword. It opens doors and creates opportunities, but it also brings scrutiny and pressure. I've learned to use fame as a platform to share positive messages and to help others, while also maintaining my privacy and staying true to my values.",
              nextNodeId: "personal-growth",
              voiceId: 'default',
            },
            "personal-growth": {
              id: "personal-growth",
              text: "My journey has been about more than just career success. It's been about personal growth, about becoming the person I want to be. I've learned that true success isn't measured by external achievements but by internal peace, by the ability to be content with who you are and what you have.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "final-wisdom": {
              id: "final-wisdom",
              text: "Life is a series of green lights. Sometimes you get them, sometimes you don't. But the key is to keep moving forward, to keep looking for the next green light. Be authentic, embrace the journey, find joy in the process, be grateful, and always be ready for the next opportunity. That's how you find your green lights.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "7",
    title: "The Cosmic Navigator: A Space Odyssey",
    label: "cosmic-navigator",
    author: "Stellar Weaver",
    coverUrl: "/images/cosmic_navigator.jpg",
    chapters: [
      {
        number: 1,
        title: "The Stellar Gateway",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "In the vast expanse of the Andromeda Galaxy, where stars are born and die in cosmic cycles, a young navigator named Nova discovers an ancient artifact that could change the fate of the universe. The Cosmic Compass, a device that can chart paths through the very fabric of space-time, has been lost for millennia. But when Nova's homeworld is threatened by the Void Shadows - entities that consume entire star systems - she must embark on a journey across the galaxy to find the compass and save her people.",
              nextNodeId: "galaxy-intro",
              voiceId: 'default',
            },
            "galaxy-intro": {
              id: "galaxy-intro",
              text: "The galaxy is a vast network of star systems, each with its own mysteries and dangers. The Cosmic Compass is said to be hidden in one of three legendary locations: the Crystal Nebula, where space itself crystallizes into beautiful formations; the Quantum Void, where the laws of physics bend and twist; or the Ancient Observatory, a space station built by a long-lost civilization. Nova must choose which path to take first.",
              choices: [
                { text: "Journey to the Crystal Nebula", nextNodeId: "crystal-nebula" },
                { text: "Navigate the Quantum Void", nextNodeId: "quantum-void" },
                { text: "Explore the Ancient Observatory", nextNodeId: "ancient-observatory" }
              ],
              voiceId: 'default',
            },
            "crystal-nebula": {
              id: "crystal-nebula",
              text: "Nova enters the Crystal Nebula, where space itself has crystallized into beautiful, geometric formations. The crystals sing with harmonic frequencies that can guide ships through the most dangerous regions of space. Here, she encounters the Crystal Guardians, beings of pure light who test her understanding of cosmic harmony. To proceed, she must solve puzzles that require her to understand the relationship between light, sound, and the fabric of space-time.",
              nextNodeId: "crystal-test",
              voiceId: 'default',
            },
            "quantum-void": {
              id: "quantum-void",
              text: "The Quantum Void is a region where the laws of physics break down and reality becomes fluid. Here, Nova must navigate through shifting dimensions where cause and effect are not always connected. She encounters quantum entities that exist in multiple states simultaneously and must learn to think in probabilities rather than certainties. The Void tests her ability to adapt to the impossible and find patterns in chaos.",
              nextNodeId: "quantum-test",
              voiceId: 'default',
            },
            "ancient-observatory": {
              id: "ancient-observatory",
              text: "The Ancient Observatory is a massive space station built by a civilization that mastered the art of stellar navigation. Its halls are filled with star charts, navigation instruments, and holographic displays showing the movement of galaxies. Here, Nova discovers the true purpose of the Cosmic Compass and learns about the ancient navigators who once used it to chart courses across the universe.",
              nextNodeId: "observatory-test",
              voiceId: 'default',
            },
            "crystal-test": {
              id: "crystal-test",
              text: "The Crystal Guardians present Nova with a test of cosmic understanding. She must align the harmonic frequencies of the crystals to create a pathway through the nebula. As she works, she learns that the universe operates on principles of resonance and harmony, and that true navigation requires understanding these cosmic rhythms.",
              nextNodeId: "compass-found",
              voiceId: 'default',
            },
            "quantum-test": {
              id: "quantum-test",
              text: "In the Quantum Void, Nova must solve puzzles that exist in multiple dimensions simultaneously. She learns to think in quantum terms, understanding that reality is not fixed but fluid. The quantum entities teach her that the Cosmic Compass works by manipulating the very fabric of space-time itself.",
              nextNodeId: "compass-found",
              voiceId: 'default',
            },
            "observatory-test": {
              id: "observatory-test",
              text: "At the Ancient Observatory, Nova discovers the true history of the Cosmic Compass. She learns that it was created by the first navigators to help them chart courses through the dangerous regions of space. The observatory's AI reveals that the compass is not just a tool, but a key to understanding the universe itself.",
              nextNodeId: "compass-found",
              voiceId: 'default',
            },
            "compass-found": {
              id: "compass-found",
              text: "Nova finally locates the Cosmic Compass, a device that glows with the light of a thousand stars. As she holds it, she feels the power of the universe flowing through her. The compass shows her the true nature of space-time and reveals the path she must take to save her homeworld from the Void Shadows.",
              nextNodeId: "final-battle",
              voiceId: 'default',
            },
            "whispering-caves": {
              id: "whispering-caves",
              text: "Kira enters the Whispering Caves, where the walls themselves hold the secrets of the ancient treasure hunters. The caves are filled with echoes of past adventurers, and Kira must listen carefully to their whispers to find the path to the Golden Vault. The caves test her ability to distinguish truth from illusion and to trust her instincts.",
              nextNodeId: "cave-secrets",
              voiceId: 'default',
            },
            "bridge-trials": {
              id: "bridge-trials",
              text: "The Bridge of Trials spans a chasm that seems to go on forever. Each step tests Kira's resolve, courage, and wisdom. The bridge is guarded by ancient spirits who ask riddles and present moral dilemmas. Kira must prove that she is worthy of the treasure by demonstrating the qualities of a true hero.",
              nextNodeId: "trial-complete",
              voiceId: 'default',
            },
            "garden-illusions": {
              id: "garden-illusions",
              text: "The Garden of Illusions is a place where nothing is as it seems. Beautiful flowers turn into dangerous creatures, peaceful streams become raging rivers, and the path constantly shifts and changes. Kira must learn to see through the illusions and find the true path to the Golden Vault.",
              nextNodeId: "illusions-overcome",
              voiceId: 'default',
            },
            "final-battle": {
              id: "final-battle",
              text: "Nova returns to her homeworld with the Cosmic Compass, just as the Void Shadows begin their final assault. Using the compass, she charts a course through the dangerous regions of space and leads her people to safety. The compass reveals that the Void Shadows are not evil, but lost entities seeking to return to their home dimension. Nova uses the compass to help them find their way home, saving both her world and the Void Shadows.",
              voiceId: 'default',
            },
            "cave-secrets": {
              id: "cave-secrets",
              text: "The whispers in the caves reveal the true nature of the Golden Vault. It is not just a treasure chamber, but a repository of knowledge and wisdom from the ancient civilization. The treasure is not gold and jewels, but the secrets of how to live a meaningful life and build a just society.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "trial-complete": {
              id: "trial-complete",
              text: "Kira successfully crosses the Bridge of Trials, proving her worthiness to the ancient spirits. They reveal that the true treasure is not material wealth, but the wisdom and courage she has gained through her journey. The spirits grant her access to the Golden Vault, where she will discover the greatest treasure of all.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "illusions-overcome": {
              id: "illusions-overcome",
              text: "Kira learns to see through the illusions and finds the true path to the Golden Vault. She discovers that the illusions were not meant to deceive her, but to teach her to trust her instincts and see beyond the surface of things. This wisdom will be essential for what she finds in the vault.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "vault-discovery": {
              id: "vault-discovery",
              text: "Kira finally reaches the Golden Vault, where she discovers that the greatest treasure is not gold or jewels, but the knowledge of how to live a meaningful life. The vault contains the wisdom of the ancient civilization, including their understanding of justice, compassion, and the importance of protecting the innocent. Kira realizes that her true quest was not to find treasure, but to become worthy of the wisdom it contains.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "8",
    title: "The Golden Vault: A Treasure Hunter's Quest",
    label: "golden-vault",
    author: "Adventure Seeker",
    coverUrl: "/images/golden_vault.jpg",
    chapters: [
      {
        number: 1,
        title: "The Lost Treasure Map",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "In the ancient city of Aurelia, where golden spires reach toward the clouds and the streets are paved with precious stones, a young treasure hunter named Kira discovers a fragment of an ancient map. The map leads to the legendary Golden Vault, a treasure chamber said to contain the greatest riches ever assembled. But the vault is protected by ancient guardians, deadly traps, and a curse that has claimed the lives of countless adventurers. Kira must decide whether to pursue this dangerous quest or leave the treasure to legend.",
              nextNodeId: "treasure-hunt",
              voiceId: 'default',
            },
            "treasure-hunt": {
              id: "treasure-hunt",
              text: "Kira studies the ancient map fragment, which shows three possible paths to the Golden Vault: through the Whispering Caves, where the walls themselves hold secrets; across the Bridge of Trials, where each step tests the seeker's resolve; or through the Garden of Illusions, where nothing is as it seems. Each path offers different challenges and rewards, and Kira must choose wisely.",
              choices: [
                { text: "Enter the Whispering Caves", nextNodeId: "whispering-caves" },
                { text: "Cross the Bridge of Trials", nextNodeId: "bridge-trials" },
                { text: "Navigate the Garden of Illusions", nextNodeId: "garden-illusions" }
              ],
              voiceId: 'default',
            },
            "cave-secrets": {
              id: "cave-secrets",
              text: "The whispers in the caves reveal the true nature of the Golden Vault. It is not just a treasure chamber, but a repository of knowledge and wisdom from the ancient civilization. The treasure is not gold and jewels, but the secrets of how to live a meaningful life and build a just society.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "trial-complete": {
              id: "trial-complete",
              text: "Kira successfully crosses the Bridge of Trials, proving her worthiness to the ancient spirits. They reveal that the true treasure is not material wealth, but the wisdom and courage she has gained through her journey. The spirits grant her access to the Golden Vault, where she will discover the greatest treasure of all.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "illusions-overcome": {
              id: "illusions-overcome",
              text: "Kira learns to see through the illusions and finds the true path to the Golden Vault. She discovers that the illusions were not meant to deceive her, but to teach her to trust her instincts and see beyond the surface of things. This wisdom will be essential for what she finds in the vault.",
              nextNodeId: "vault-discovery",
              voiceId: 'default',
            },
            "vault-discovery": {
              id: "vault-discovery",
              text: "Kira finally reaches the Golden Vault, where she discovers that the greatest treasure is not gold or jewels, but the knowledge of how to live a meaningful life. The vault contains the wisdom of the ancient civilization, including their understanding of justice, compassion, and the importance of protecting the innocent. Kira realizes that her true quest was not to find treasure, but to become worthy of the wisdom it contains.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "9",
    title: "The Thursday Murder Club",
    label: "thursday-murder-club",
    author: "Richard Osman",
    coverUrl: "/images/thursday_murder.jpg",
    chapters: [
      {
        number: 1,
        title: "The Coopers Chase Mystery",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "In a peaceful retirement village in the Kent countryside, four septuagenarians meet every Thursday to discuss unsolved murders. Elizabeth, Joyce, Ibrahim, and Ron have formed the Thursday Murder Club, and they're about to get their hands on a real case. When a local property developer is found dead, the four friends find themselves in the middle of a genuine murder investigation.",
              nextNodeId: "club-intro",
              voiceId: 'default',
            },
            "club-intro": {
              id: "club-intro",
              text: "The Thursday Murder Club consists of four very different personalities: Elizabeth, a former MI5 agent with a sharp mind and mysterious past; Joyce, a retired nurse with a talent for getting people to talk; Ibrahim, a former psychiatrist with keen observational skills; and Ron, a former trade union leader with a big heart and even bigger opinions.",
              choices: [
                { text: "Learn about the murder victim", nextNodeId: "murder-victim" },
                { text: "Explore the retirement village", nextNodeId: "retirement-village" },
                { text: "Meet the local police", nextNodeId: "local-police" }
              ],
              voiceId: 'default',
            },
            "murder-victim": {
              id: "murder-victim",
              text: "The victim is Tony Curran, a property developer who was planning to build luxury homes on the site of the retirement village. He was found dead in his car, and the police are treating it as murder. The Thursday Murder Club quickly realizes that this case is more complex than it appears, with multiple suspects and motives.",
              nextNodeId: "investigation-begins",
              voiceId: 'default',
            },
            "retirement-village": {
              id: "retirement-village",
              text: "Coopers Chase is a peaceful retirement village where the residents enjoy their golden years. But beneath the surface, there are tensions and secrets. The proposed development has divided the community, with some residents supporting it for the financial benefits and others opposing it for environmental and quality-of-life reasons.",
              nextNodeId: "investigation-begins",
              voiceId: 'default',
            },
            "local-police": {
              id: "local-police",
              text: "The local police are led by Detective Sergeant Donna De Freitas, who is initially skeptical of the Thursday Murder Club's involvement. But as the case progresses, she begins to appreciate their unique insights and unconventional methods. Together, they form an unlikely but effective partnership.",
              nextNodeId: "investigation-begins",
              voiceId: 'default',
            },
            "investigation-begins": {
              id: "investigation-begins",
              text: "The Thursday Murder Club begins their investigation, using their combined skills and local knowledge. They interview residents, examine evidence, and piece together the events leading up to the murder. Each member brings their own expertise to the case, and they quickly discover that everyone has something to hide.",
              choices: [
                { text: "Follow Elizabeth's investigation", nextNodeId: "elizabeth-investigation" },
                { text: "Join Joyce's interviews", nextNodeId: "joyce-interviews" },
                { text: "Work with Ibrahim's analysis", nextNodeId: "ibrahim-analysis" }
              ],
              voiceId: 'default',
            },
            "elizabeth-investigation": {
              id: "elizabeth-investigation",
              text: "Elizabeth uses her MI5 training to dig deeper into the case. She discovers connections between the victim and several residents, including financial dealings and personal relationships. Her investigation reveals that the murder may be connected to a larger conspiracy involving the development project.",
              nextNodeId: "clues-emerge",
              voiceId: 'default',
            },
            "joyce-interviews": {
              id: "joyce-interviews",
              text: "Joyce uses her nursing skills to gain the trust of residents and extract information. She discovers that many people had reasons to want Tony Curran dead, from financial disputes to personal grievances. Her gentle approach uncovers secrets that the police missed.",
              nextNodeId: "clues-emerge",
              voiceId: 'default',
            },
            "ibrahim-analysis": {
              id: "ibrahim-analysis",
              text: "Ibrahim applies his psychiatric training to analyze the behavior of suspects and witnesses. He identifies patterns in their stories and detects inconsistencies that point to deception. His analysis helps the team understand the psychological motivations behind the murder.",
              nextNodeId: "clues-emerge",
              voiceId: 'default',
            },
            "clues-emerge": {
              id: "clues-emerge",
              text: "As the investigation progresses, the Thursday Murder Club uncovers a web of lies, secrets, and hidden connections. They discover that the murder is more complex than a simple property dispute, involving family secrets, financial fraud, and long-buried grudges.",
              nextNodeId: "final-revelation",
              voiceId: 'default',
            },
            "final-revelation": {
              id: "final-revelation",
              text: "The Thursday Murder Club finally pieces together the truth. The murder was committed by someone they never suspected, for reasons that go back decades. With the help of the police, they bring the killer to justice, but not without some surprising twists and turns along the way.",
              choices: [
                { text: "Learn the identity of the killer", nextNodeId: "killer-revealed" },
                { text: "Discover the motive", nextNodeId: "motive-revealed" }
              ],
              voiceId: 'default',
            },
            "killer-revealed": {
              id: "killer-revealed",
              text: "The killer is revealed to be someone close to the community, someone who had been hiding in plain sight. The revelation shocks everyone, including the Thursday Murder Club, who realize that even in a peaceful retirement village, people can harbor dark secrets and hidden motives.",
              voiceId: 'default',
            },
            "motive-revealed": {
              id: "motive-revealed",
              text: "The motive for the murder is revealed to be connected to events from the past, involving family secrets and financial wrongdoing. The killer acted out of desperation and fear, believing that the victim's development project would expose their hidden past and destroy their carefully constructed life.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  },
  {
    id: "10",
    title: "The Mind's Labyrinth: A Journey of Discovery",
    label: "minds-labyrinth",
    author: "Cognitive Explorer",
    coverUrl: "/images/minds_labyrinth.png",
    chapters: [
      {
        number: 1,
        title: "The Labyrinth of Thoughts",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "In the depths of the Mind's Labyrinth, where thoughts take physical form and beliefs become walls that can be rebuilt, a young scholar named Sage discovers that her world is not what it seems. The labyrinth is a vast, ever-changing maze where each corridor represents a different way of thinking, and the walls themselves are made of solidified beliefs. When Sage's mentor, the Wise Architect, disappears into the deepest levels of the labyrinth, she must navigate through the maze of her own assumptions to find him and discover the truth about the nature of knowledge itself.",
              nextNodeId: "labyrinth-intro",
              voiceId: 'default',
            },
            "labyrinth-intro": {
              id: "labyrinth-intro",
              text: "The Mind's Labyrinth is divided into three distinct regions, each representing a different approach to thinking. The Hall of Certainty, where thoughts are rigid and unchangeable; the Chamber of Doubt, where all beliefs are questioned; and the Garden of Curiosity, where new ideas bloom and grow. Sage must choose which path to take first, knowing that each will teach her different lessons about the nature of knowledge and the power of changing one's mind.",
              choices: [
                { text: "Enter the Hall of Certainty", nextNodeId: "hall-certainty" },
                { text: "Explore the Chamber of Doubt", nextNodeId: "chamber-doubt" },
                { text: "Wander the Garden of Curiosity", nextNodeId: "garden-curiosity" }
              ],
              voiceId: 'default',
            },
            "hall-certainty": {
              id: "hall-certainty",
              text: "Sage enters the Hall of Certainty, where the walls are made of unbreakable stone and the air is thick with the weight of absolute truth. Here, she encounters the Preachers, Prosecutors, and Politicians - three groups of thinkers who each believe they have the final answer. The Preachers try to convert her to their way of thinking, the Prosecutors try to prove others wrong, and the Politicians seek to win arguments rather than find truth. Sage realizes that this rigid thinking is what creates the walls of the labyrinth itself.",
              nextNodeId: "certainty-lesson",
              voiceId: 'default',
            },
            "chamber-doubt": {
              id: "chamber-doubt",
              text: "In the Chamber of Doubt, Sage finds herself surrounded by mirrors that reflect her deepest fears and insecurities. Here, she learns that being wrong feels threatening because it challenges her identity and self-worth. The chamber is filled with the voices of her past mistakes and failed attempts, but she also discovers that doubt is not the enemy of knowledge - it's the foundation of learning. The mirrors show her that the fear of being wrong is what keeps her trapped in the labyrinth.",
              nextNodeId: "doubt-lesson",
              voiceId: 'default',
            },
            "garden-curiosity": {
              id: "garden-curiosity",
              text: "The Garden of Curiosity is a place where ideas bloom like flowers and questions grow like trees. Here, Sage encounters the Wise Architect, who explains that intellectual humility is not about being uncertain, but about being confident in one's ability to learn and grow. The garden is filled with floating questions, each one leading to new discoveries. Sage learns that curiosity is the key to navigating the labyrinth and that the most beautiful thoughts are those that are still growing.",
              nextNodeId: "curiosity-lesson",
              voiceId: 'default',
            },
            "certainty-lesson": {
              id: "certainty-lesson",
              text: "In the Hall of Certainty, Sage learns that rigid thinking creates the very walls that trap her in the labyrinth. She discovers that the Preachers, Prosecutors, and Politicians are all different manifestations of the same problem: the unwillingness to change one's mind. As she watches them argue endlessly, she realizes that true wisdom comes not from being right, but from being open to learning. The walls of the hall begin to crack as she questions her own certainties.",
              nextNodeId: "labyrinth-transformation",
              voiceId: 'default',
            },
            "doubt-lesson": {
              id: "doubt-lesson",
              text: "In the Chamber of Doubt, Sage confronts her deepest fears about being wrong. She learns that doubt is not the enemy of knowledge, but its foundation. The mirrors show her that the fear of being wrong is what keeps her trapped in the labyrinth, and that embracing uncertainty is the first step toward true learning. As she accepts her doubts, the mirrors begin to show her new possibilities instead of just her fears.",
              nextNodeId: "labyrinth-transformation",
              voiceId: 'default',
            },
            "curiosity-lesson": {
              id: "curiosity-lesson",
              text: "In the Garden of Curiosity, Sage meets the Wise Architect, who explains that intellectual humility is the key to navigating the labyrinth. The garden is filled with floating questions that lead to new discoveries, and Sage learns that the most beautiful thoughts are those that are still growing. The Architect shows her that curiosity is not about having all the answers, but about asking the right questions.",
              nextNodeId: "labyrinth-transformation",
              voiceId: 'default',
            },
            "labyrinth-transformation": {
              id: "labyrinth-transformation",
              text: "As Sage applies the lessons from all three regions of the labyrinth, she begins to see the maze transform around her. The rigid walls of certainty become flexible, the mirrors of doubt show new possibilities, and the garden of curiosity expands to fill the entire labyrinth. She realizes that the labyrinth is not a prison, but a tool for learning and growth. The Wise Architect appears and explains that the ability to rethink and unlearn is more important than the ability to think and learn.",
              nextNodeId: "final-discovery",
              voiceId: 'default',
            },
            "final-discovery": {
              id: "final-discovery",
              text: "Sage finally reaches the center of the labyrinth, where she discovers the greatest treasure of all: the ability to change her mind. The Wise Architect reveals that the labyrinth was never about finding the right answer, but about learning to ask better questions. Sage realizes that in a rapidly changing world, the ability to rethink and unlearn is the greatest advantage of all. She emerges from the labyrinth not with all the answers, but with the wisdom to keep learning and growing.",
              voiceId: 'default',
            },
            "final-wisdom": {
              id: "final-wisdom",
              text: "The ability to rethink and unlearn may be more important than the ability to think and learn. In a rapidly changing world, the ability to change your mind is a competitive advantage. It's not about being uncertain or indecisive - it's about being confident in your ability to learn and grow. The goal is not to be right, but to get it right.",
              voiceId: 'default',
            }
          }
        }
      }
    ],
    currentChapter: 1,
    totalChapters: 1
  }
]