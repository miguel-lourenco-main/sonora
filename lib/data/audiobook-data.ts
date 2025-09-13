import { Audiobook } from "../types"

// This is sample data
export const featuredAudiobooks: Audiobook[] = [
  {
    id: "1",
    title: "The Enchanted Forest: An Interactive Tale",
    author: "A. I. Storyteller",
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9wm1QiJmXT9Rqir1ZnZTk7GBifUnsv.png",
    duration: "2h 15m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "enchanted-forest"
  },
  {
    id: "2",
    title: "The Mystic Mountain: A Journey of Choices",
    author: "Digital Wordsmith",
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9wm1QiJmXT9Rqir1ZnZTk7GBifUnsv.png",
    duration: "3h 45m",
    narrator: "AI Voice",
    category: "Fiction",
    label: "mystic-mountain"
  },
  {
    id: "3",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "8h 50m",
    narrator: "Carey Mulligan",
    category: "Fiction",
    label: "midnight-library"
  },
  {
    id: "4",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "5h 35m",
    narrator: "James Clear",
    category: "Self-Development",
    label: "atomic-habits"
  },
  {
    id: "5",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "16h 10m",
    narrator: "Ray Porter",
    category: "Sci-Fi",
    label: "project-hail-mary"
  },
  {
    id: "6",
    title: "Greenlights",
    author: "Matthew McConaughey",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "6h 42m",
    narrator: "Matthew McConaughey",
    category: "Biography",
    label: "greenlights"
  }
]

export const recommendedAudiobooks = [
  {
    id: "7",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "21h 2m",
    narrator: "Scott Brick",
    category: "Sci-Fi",
    label: "dune"
  },
  {
    id: "8",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "5h 48m",
    narrator: "Chris Hill",
    category: "Finance",
    label: "psychology-of-money"
  },
  {
    id: "9",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "12h 25m",
    narrator: "Lesley Manville",
    category: "Mystery",
    label: "thursday-murder-club"
  },
  {
    id: "10",
    title: "Think Again",
    author: "Adam Grant",
    coverUrl: "/images/placeholder.svg?height=400&width=300",
    duration: "6h 40m",
    narrator: "Adam Grant",
    category: "Psychology",
    label: "think-again"
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