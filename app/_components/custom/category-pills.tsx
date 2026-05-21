"use client"

// Horizontal catalog filters; supports controlled or internal selected state.

import * as React from "react"
import { cn } from "@kit/ui/lib"
import { SonoraChip } from "@/components/sonora"

interface CategoryPillsProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: string[]
  selected?: string
  onCategorySelect?: (category: string) => void
}

export function CategoryPills({
  categories,
  selected: controlledSelected,
  onCategorySelect,
  className,
  ...props
}: CategoryPillsProps) {
  const [internalSelected, setInternalSelected] = React.useState(categories[0] ?? "All Stories")
  const selected = controlledSelected ?? internalSelected

  const handleSelect = (category: string) => {
    setInternalSelected(category)
    onCategorySelect?.(category)
  }

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2 hide-scrollbar md:flex-wrap md:justify-center md:overflow-visible",
        className,
      )}
      {...props}
    >
      {categories.map((category) => (
        <SonoraChip
          key={category}
          label={category}
          active={selected === category}
          onClick={() => handleSelect(category)}
        />
      ))}
    </div>
  )
}
