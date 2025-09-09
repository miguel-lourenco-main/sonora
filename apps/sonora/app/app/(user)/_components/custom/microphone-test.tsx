"use client"

import { useState } from "react"
import { Button } from "@kit/ui/button"
import { SparkleBorder } from "@kit/ui/sparkle-border"

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