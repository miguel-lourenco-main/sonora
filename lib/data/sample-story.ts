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
  },
  {
    id: "3",
    title: "The Midnight Library",
    label: "midnight-library",
    author: "Matt Haig",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
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
    title: "Atomic Habits",
    label: "atomic-habits",
    author: "James Clear",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    chapters: [
      {
        number: 1,
        title: "The Fundamentals",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Small changes can make a remarkable difference. If you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Conversely, if you get 1 percent worse each day for one year, you'll decline nearly down to zero. What starts as a small win or a minor setback accumulates into something much more.",
              nextNodeId: "habit-loop",
              voiceId: 'default',
            },
            "habit-loop": {
              id: "habit-loop",
              text: "Every habit follows the same pattern: Cue, Craving, Response, and Reward. The cue triggers your brain to initiate a behavior. The craving is the motivational force behind every habit. The response is the actual habit you perform. The reward is the end goal of every habit.",
              choices: [
                { text: "Learn about making habits obvious", nextNodeId: "obvious-habits" },
                { text: "Learn about making habits attractive", nextNodeId: "attractive-habits" },
                { text: "Learn about making habits easy", nextNodeId: "easy-habits" },
                { text: "Learn about making habits satisfying", nextNodeId: "satisfying-habits" }
              ],
              voiceId: 'default',
            },
            "obvious-habits": {
              id: "obvious-habits",
              text: "The first law of behavior change is to make it obvious. You can't change a habit if you're not aware of it. Start by creating a habit scorecard - simply list your daily habits and mark them as positive, negative, or neutral. Then use implementation intentions: 'I will [BEHAVIOR] at [TIME] in [LOCATION].'",
              nextNodeId: "habit-stacking",
              voiceId: 'default',
            },
            "attractive-habits": {
              id: "attractive-habits",
              text: "The second law is to make it attractive. Use temptation bundling - pair an action you want to do with an action you need to do. Join a culture where your desired behavior is the normal behavior. Create a motivation ritual by doing something you enjoy immediately before a difficult habit.",
              nextNodeId: "habit-stacking",
              voiceId: 'default',
            },
            "easy-habits": {
              id: "easy-habits",
              text: "The third law is to make it easy. Reduce friction for good habits and increase friction for bad habits. Use the two-minute rule: when you start a new habit, it should take less than two minutes to do. Focus on taking action, not being in motion.",
              nextNodeId: "habit-stacking",
              voiceId: 'default',
            },
            "satisfying-habits": {
              id: "satisfying-habits",
              text: "The fourth law is to make it satisfying. Use immediate rewards to reinforce good habits. Track your habits with a simple method like marking an X on a calendar. Never miss twice - if you miss one day, try to get back on track as quickly as possible.",
              nextNodeId: "habit-stacking",
              voiceId: 'default',
            },
            "habit-stacking": {
              id: "habit-stacking",
              text: "One of the best ways to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top. The formula is: 'After I [CURRENT HABIT], I will [NEW HABIT].' This creates a clear trigger for your new habit.",
              nextNodeId: "environment-design",
              voiceId: 'default',
            },
            "environment-design": {
              id: "environment-design",
              text: "Your environment is the invisible hand that shapes human behavior. Small changes in context can lead to large changes in behavior over time. Make the cues of good habits obvious and the cues of bad habits invisible. Design your environment to make good habits easier and bad habits harder.",
              nextNodeId: "conclusion",
              voiceId: 'default',
            },
            "conclusion": {
              id: "conclusion",
              text: "Success is the product of daily habits, not once-in-a-lifetime transformations. You don't rise to the level of your goals; you fall to the level of your systems. Focus on your systems, not your goals. The goal is not to read a book, the goal is to become a reader. The goal is not to run a marathon, the goal is to become a runner.",
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
    coverUrl: "/images/placeholder.svg?height=400&width=300",
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
    coverUrl: "/images/placeholder.svg?height=400&width=300",
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
    title: "Dune",
    label: "dune",
    author: "Frank Herbert",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    chapters: [
      {
        number: 1,
        title: "The Desert Planet",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows. To begin your study of the life of Muad'Dib, then, take care that you first place him in his time: born in the 57th year of the Padishah Emperor, Shaddam IV. And take the most special care that you locate Muad'Dib in his place: the planet Arrakis. Do not be deceived by the fact that he was born on Caladan and lived his first fifteen years there. Arrakis, the planet known as Dune, is forever his place.",
              nextNodeId: "arrakis-intro",
              voiceId: 'default',
            },
            "arrakis-intro": {
              id: "arrakis-intro",
              text: "Arrakis is a desert planet, harsh and unforgiving, where water is more precious than gold. It is the only source of the spice melange, the most valuable substance in the universe. The spice extends life, expands consciousness, and makes interstellar travel possible. Control of Arrakis means control of the universe.",
              choices: [
                { text: "Learn about the spice melange", nextNodeId: "spice-knowledge" },
                { text: "Explore the Fremen culture", nextNodeId: "fremen-culture" },
                { text: "Understand the political situation", nextNodeId: "political-situation" }
              ],
              voiceId: 'default',
            },
            "spice-knowledge": {
              id: "spice-knowledge",
              text: "The spice melange is produced by the giant sandworms that live in the deep desert. It is harvested by the native Fremen, who have learned to survive in the harsh environment. The spice is essential for the Guild Navigators, who use it to fold space and enable faster-than-light travel. Without spice, the galactic civilization would collapse.",
              nextNodeId: "paul-arrival",
              voiceId: 'default',
            },
            "fremen-culture": {
              id: "fremen-culture",
              text: "The Fremen are the native people of Arrakis, adapted to life in the desert. They are fierce warriors who have learned to survive in the harshest conditions. They believe in a prophecy of a messiah who will lead them to freedom. They have developed advanced techniques for water conservation and desert survival.",
              nextNodeId: "paul-arrival",
              voiceId: 'default',
            },
            "political-situation": {
              id: "political-situation",
              text: "The Atreides family has been given control of Arrakis by the Emperor, replacing the Harkonnens. This is a trap - the Emperor fears the growing power of House Atreides and has conspired with the Harkonnens to destroy them. The Atreides must navigate this political minefield while learning to survive on the dangerous planet.",
              nextNodeId: "paul-arrival",
              voiceId: 'default',
            },
            "paul-arrival": {
              id: "paul-arrival",
              text: "Paul Atreides, the young heir to House Atreides, arrives on Arrakis with his family. He has been trained in the ways of the Bene Gesserit and has inherited his father's political acumen. But he is about to discover that his destiny is far greater than he imagined.",
              choices: [
                { text: "Follow Paul's training with the Fremen", nextNodeId: "fremen-training" },
                { text: "Explore Paul's prescient visions", nextNodeId: "prescient-visions" },
                { text: "Learn about the betrayal and attack", nextNodeId: "betrayal-attack" }
              ],
              voiceId: 'default',
            },
            "fremen-training": {
              id: "fremen-training",
              text: "Paul learns the ways of the Fremen, including their fighting techniques and desert survival skills. He proves himself to be a natural leader and warrior. The Fremen begin to see him as the fulfillment of their prophecy, the Lisan al-Gaib, the voice from the outer world.",
              nextNodeId: "paul-transformation",
              voiceId: 'default',
            },
            "prescient-visions": {
              id: "prescient-visions",
              text: "Paul begins to experience prescient visions, seeing possible futures. He realizes that he has the power to see through time and space, a gift that comes from exposure to the spice. These visions show him the terrible cost of the path he must take, but also the necessity of his actions.",
              nextNodeId: "paul-transformation",
              voiceId: 'default',
            },
            "betrayal-attack": {
              id: "betrayal-attack",
              text: "The Harkonnens, with the help of the Emperor's Sardaukar troops, attack the Atreides stronghold. Paul's father is killed, and he and his mother must flee into the desert. This betrayal sets Paul on the path to becoming Muad'Dib, the leader of the Fremen rebellion.",
              nextNodeId: "paul-transformation",
              voiceId: 'default',
            },
            "paul-transformation": {
              id: "paul-transformation",
              text: "Paul transforms into Muad'Dib, the leader of the Fremen. He unites the desert tribes and leads them in a holy war against the Harkonnens and the Emperor. He becomes a messianic figure, worshipped by his followers, but he also sees the terrible consequences of his actions.",
              nextNodeId: "final-battle",
              voiceId: 'default',
            },
            "final-battle": {
              id: "final-battle",
              text: "The final battle for Arrakis begins. Paul leads the Fremen in a massive assault on the Harkonnen strongholds. The battle is fierce and bloody, but Paul's prescient abilities give him an advantage. He must choose between his personal desires and the greater good of the universe.",
              choices: [
                { text: "Paul chooses to embrace his destiny", nextNodeId: "destiny-embraced" },
                { text: "Paul tries to find an alternative path", nextNodeId: "alternative-path" }
              ],
              voiceId: 'default',
            },
            "destiny-embraced": {
              id: "destiny-embraced",
              text: "Paul embraces his destiny as Muad'Dib and the Kwisatz Haderach. He leads the Fremen to victory and becomes the new Emperor. But he realizes that his victory has come at a terrible cost, and that the path he has chosen will lead to a galactic jihad that will claim billions of lives.",
              voiceId: 'default',
            },
            "alternative-path": {
              id: "alternative-path",
              text: "Paul tries to find an alternative path, but his prescient visions show him that there is no other way. The universe is on a collision course with destiny, and he must play his part. He accepts his role as Muad'Dib, knowing that it will bring both salvation and destruction.",
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
    title: "The Psychology of Money",
    label: "psychology-of-money",
    author: "Morgan Housel",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    chapters: [
      {
        number: 1,
        title: "The Psychology of Wealth",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave. And behavior is hard to teach, even to really smart people. A genius who loses control of their emotions can be a financial disaster. The opposite is also true. Ordinary people with no financial education can be wealthy if they have a handful of behavioral skills that have nothing to do with formal measures of intelligence.",
              nextNodeId: "money-psychology",
              voiceId: 'default',
            },
            "money-psychology": {
              id: "money-psychology",
              text: "Money is everywhere, it affects all of us, and I'm convinced that it's one of the biggest things on our minds. But for something that plays such a big role in our lives, we don't talk about it much. We don't teach it in schools. We don't discuss it at dinner parties. We don't even talk about it with our spouses, in many cases.",
              choices: [
                { text: "Learn about the role of luck in wealth", nextNodeId: "luck-wealth" },
                { text: "Explore the concept of enough", nextNodeId: "concept-enough" },
                { text: "Understand the power of compounding", nextNodeId: "power-compounding" }
              ],
              voiceId: 'default',
            },
            "luck-wealth": {
              id: "luck-wealth",
              text: "Luck and risk are both the reality that every outcome in life is guided by forces other than individual effort. They are so similar that you can't believe in one without equally respecting the other. They both happen because the world is too complex to allow 100% of your actions to dictate 100% of your outcomes.",
              nextNodeId: "money-lessons",
              voiceId: 'default',
            },
            "concept-enough": {
              id: "concept-enough",
              text: "The hardest financial skill is getting the goalpost to stop moving. But it's one of the most important. Social comparison is the problem here. The ceiling of social comparison is so high that virtually no one will ever hit it. Which means it's a battle that can never be won, or that the only way to win is to not fight to begin with.",
              nextNodeId: "money-lessons",
              voiceId: 'default',
            },
            "power-compounding": {
              id: "power-compounding",
              text: "Compounding is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it. Compounding doesn't rely on earning big returns. Merely good returns sustained uninterrupted for the longest period of time - especially in times of chaos and havoc - will always win.",
              nextNodeId: "money-lessons",
              voiceId: 'default',
            },
            "money-lessons": {
              id: "money-lessons",
              text: "The most important part of every plan is planning on your plan not going according to plan. The future is uncertain, and the best we can do is prepare for the unexpected. This means having emergency funds, diversifying investments, and being flexible in our approach to money and life.",
              nextNodeId: "wealth-building",
              voiceId: 'default',
            },
            "wealth-building": {
              id: "wealth-building",
              text: "Wealth is what you don't see. It's the cars not purchased. The diamonds not bought. The watches not worn, the clothes forgone and the first-class upgrade declined. Wealth is financial assets that haven't yet been converted into the stuff you see.",
              choices: [
                { text: "Learn about the importance of saving", nextNodeId: "importance-saving" },
                { text: "Explore the psychology of spending", nextNodeId: "psychology-spending" },
                { text: "Understand the value of patience", nextNodeId: "value-patience" }
              ],
              voiceId: 'default',
            },
            "importance-saving": {
              id: "importance-saving",
              text: "Saving is a hedge against life's inevitable ability to surprise the hell out of you at the worst possible moment. The ability to do what you want, when you want, with who you want, for as long as you want, is priceless. It is the highest dividend money pays.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "psychology-spending": {
              id: "psychology-spending",
              text: "Spending money to show people how much money you have is the fastest way to have less money. The point of money is to give you options and flexibility. The ability to do what you want, when you want, with who you want, for as long as you want, is priceless.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "value-patience": {
              id: "value-patience",
              text: "Patience is the rarest resource in a world where everyone wants to get rich quick. The ability to wait is the ability to let compound interest work its magic. Time is the most powerful force in investing, and patience is the key to unlocking its power.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "final-wisdom": {
              id: "final-wisdom",
              text: "The most important thing is to stay in the game. The most important thing is to not get wiped out. The most important thing is to survive. Because if you survive, you get to play another day. And if you get to play another day, you get to compound. And if you get to compound, you get to build wealth.",
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
    coverUrl: "/images/placeholder.svg?height=400&width=300",
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
    title: "Think Again",
    label: "think-again",
    author: "Adam Grant",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    chapters: [
      {
        number: 1,
        title: "The Power of Rethinking",
        content: {
          initialNodeId: "start",
          nodes: {
            "start": {
              id: "start",
              text: "The ability to rethink and unlearn may be more important than the ability to think and learn. In a rapidly changing world, the ability to change your mind is a competitive advantage. But most of us are terrible at it. We cling to our beliefs even when evidence suggests we're wrong. We surround ourselves with people who agree with us. We seek out information that confirms what we already think.",
              nextNodeId: "rethinking-intro",
              voiceId: 'default',
            },
            "rethinking-intro": {
              id: "rethinking-intro",
              text: "Rethinking is a set of skills that can be learned and developed. It involves questioning your assumptions, seeking out disconfirming evidence, and being open to changing your mind. It's about being confident in your ability to learn and grow, rather than being confident in your current knowledge.",
              choices: [
                { text: "Learn about the three types of thinking", nextNodeId: "three-types-thinking" },
                { text: "Explore the psychology of being wrong", nextNodeId: "psychology-wrong" },
                { text: "Understand the importance of intellectual humility", nextNodeId: "intellectual-humility" }
              ],
              voiceId: 'default',
            },
            "three-types-thinking": {
              id: "three-types-thinking",
              text: "There are three types of thinking: thinking like a preacher, a prosecutor, or a politician. Preachers think they're right and try to convert others. Prosecutors think others are wrong and try to prove it. Politicians think about winning and try to gain support. But the most effective thinking is like a scientist: curious, open-minded, and focused on discovering the truth.",
              nextNodeId: "rethinking-skills",
              voiceId: 'default',
            },
            "psychology-wrong": {
              id: "psychology-wrong",
              text: "Being wrong feels threatening because it challenges our identity and self-worth. We often confuse our beliefs with our identity, so when our beliefs are challenged, we feel like we're being attacked. This is why we defend our beliefs so fiercely, even when we know they might be wrong.",
              nextNodeId: "rethinking-skills",
              voiceId: 'default',
            },
            "intellectual-humility": {
              id: "intellectual-humility",
              text: "Intellectual humility is the recognition that you might be wrong. It's not about being uncertain or indecisive - it's about being confident in your ability to learn and grow. People with intellectual humility are more open to new information, more willing to change their minds, and more effective at solving problems.",
              nextNodeId: "rethinking-skills",
              voiceId: 'default',
            },
            "rethinking-skills": {
              id: "rethinking-skills",
              text: "Rethinking is a skill that can be developed through practice. It involves asking better questions, seeking out disconfirming evidence, and being open to changing your mind. It's about being curious rather than certain, and about focusing on learning rather than being right.",
              nextNodeId: "practical-applications",
              voiceId: 'default',
            },
            "practical-applications": {
              id: "practical-applications",
              text: "Rethinking has practical applications in many areas of life: in our careers, our relationships, and our personal growth. It helps us make better decisions, solve problems more effectively, and adapt to change. It's a skill that becomes more valuable as the world becomes more complex and uncertain.",
              choices: [
                { text: "Learn about rethinking in the workplace", nextNodeId: "workplace-rethinking" },
                { text: "Explore rethinking in relationships", nextNodeId: "relationship-rethinking" },
                { text: "Understand rethinking in personal growth", nextNodeId: "personal-growth-rethinking" }
              ],
              voiceId: 'default',
            },
            "workplace-rethinking": {
              id: "workplace-rethinking",
              text: "In the workplace, rethinking helps us adapt to change, solve problems more effectively, and work better with others. It's especially important for leaders, who need to be able to change their minds when new information becomes available. Organizations that encourage rethinking are more innovative and resilient.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "relationship-rethinking": {
              id: "relationship-rethinking",
              text: "In relationships, rethinking helps us understand others better, resolve conflicts more effectively, and build stronger connections. It's about being open to different perspectives and being willing to change your mind about people and situations. This leads to more empathy and better communication.",
              nextNodeId: "final-wisdom",
              voiceId: 'default',
            },
            "personal-growth-rethinking": {
              id: "personal-growth-rethinking",
              text: "In personal growth, rethinking helps us learn from our mistakes, adapt to new circumstances, and become better versions of ourselves. It's about being open to feedback, willing to change, and focused on continuous improvement. This leads to greater resilience and personal fulfillment.",
              nextNodeId: "final-wisdom",
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