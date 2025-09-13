"use client"

import { useState } from "react"
import { Button } from "@kit/ui/shadcn/button"
import { SparkleBorder } from "@kit/ui/magic-ui/sparkle-border"

export function MicrophoneTest() {
  const [isActive, setIsActive] = useState(false);

  return (
    <SparkleBorder isSelected={isActive}>
      <Button
        variant="outline"
        onClick={() => setIsActive(!isActive)}
      >
        Test Microphone
      </Button>
    </SparkleBorder>
  )
} 