import { Audiobook } from "../types"

// This is sample data
export const featuredAudiobooks: Audiobook[] = [
  {
    id: "1",
    title: "The Enchanted Forest: An Interactive Tale",
    author: "A. I. Storyteller",
    coverUrl: "/images/enchanted_forest.jpg",
    duration: "2h 15m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "enchanted-forest"
  },
  {
    id: "2",
    title: "The Mystic Mountain: A Journey of Choices",
    author: "Digital Wordsmith",
    coverUrl: "/images/mystic_mountain.jpg",
    duration: "3h 45m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "mystic-mountain"
  },
  {
    id: "3",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/images/midnight_library.jpg",
    duration: "8h 50m",
    narrator: "Carey Mulligan",
    category: "Fiction",
    label: "midnight-library"
  },
  {
    id: "4",
    title: "The Clockwork Kingdom: A Tale of Transformation",
    author: "Luna Mechanica",
    coverUrl: "/images/clockwork_kingdom.png",
    duration: "5h 35m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "clockwork-kingdom"
  },
  {
    id: "5",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "/images/project_hail_mary.jpg",
    duration: "16h 10m",
    narrator: "Ray Porter",
    category: "Sci-Fi",
    label: "project-hail-mary"
  },
  {
    id: "6",
    title: "Greenlights",
    author: "Matthew McConaughey",
    coverUrl: "/images/greenlights.jpg",
    duration: "6h 42m",
    narrator: "Matthew McConaughey",
    category: "Biography",
    label: "greenlights"
  }
]

export const recommendedAudiobooks = [
  {
    id: "7",
    title: "The Cosmic Navigator: A Space Odyssey",
    author: "Stellar Weaver",
    coverUrl: "/images/cosmic_navigator.jpg",
    duration: "21h 2m",
    narrator: "AI Voice",
    category: "Sci-Fi",
    label: "cosmic-navigator"
  },
  {
    id: "8",
    title: "The Golden Vault: A Treasure Hunter's Quest",
    author: "Adventure Seeker",
    coverUrl: "/images/golder_vault.jpg",
    duration: "5h 48m",
    narrator: "AI Voice",
    category: "Adventure",
    label: "golden-vault"
  },
  {
    id: "9",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    coverUrl: "/images/thursday_murder.jpg",
    duration: "12h 25m",
    narrator: "Lesley Manville",
    category: "Mystery",
    label: "thursday-murder-club"
  },
  {
    id: "10",
    title: "The Mind's Labyrinth: A Journey of Discovery",
    author: "Cognitive Explorer",
    coverUrl: "/images/minds_labyrinth.png",
    duration: "6h 40m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "minds-labyrinth"
  }
]

export const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Sci-Fi",
  "Biography",
  "Self-Development",
  "Business",
  "Romance",
  "History",
  "Finance",
  "Psychology"
]