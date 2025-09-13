"use client"

import * as React from "react"
import { ScrollArea, ScrollBar } from "@kit/ui/shadcn/scroll-area"
import { cn } from "@kit/ui/lib"

interface CategoryPillsProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: string[]
}

export function CategoryPills({
  categories,
  className,
  ...props
}: CategoryPillsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className={cn("flex w-max space-x-2 p-1", className)} {...props}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedCategory === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}