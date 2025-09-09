import { Audiobook } from "../types"

// This is sample data
export const featuredAudiobooks: Audiobook[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "8h 50m",
    narrator: "Carey Mulligan",
    category: "Fiction"
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "5h 35m",
    narrator: "James Clear",
    category: "Self-Development"
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "16h 10m",
    narrator: "Ray Porter",
    category: "Sci-Fi"
  },
  {
    id: "4",
    title: "Greenlights",
    author: "Matthew McConaughey",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "6h 42m",
    narrator: "Matthew McConaughey",
    category: "Biography"
  }
]

export const recommendedAudiobooks = [
  {
    id: "5",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "21h 2m",
    narrator: "Scott Brick",
    category: "Sci-Fi"
  },
  {
    id: "6",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "5h 48m",
    narrator: "Chris Hill",
    category: "Finance"
  },
  {
    id: "7",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "12h 25m",
    narrator: "Lesley Manville",
    category: "Mystery"
  },
  {
    id: "8",
    title: "Think Again",
    author: "Adam Grant",
    coverUrl: "/placeholder.svg?height=400&width=300",
    duration: "6h 40m",
    narrator: "Adam Grant",
    category: "Psychology"
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
  "History"
]