'use client'

import * as React from 'react'

export interface useCopyToClipboardProps {
  timeout?: number
}

/**
 * A React hook that provides clipboard copy functionality with a temporary success state
 * 
 * @param {Object} options - Hook configuration options
 * @param {number} [options.timeout=2000] - Duration in milliseconds to show the success state
 * @returns {Object} Hook state and methods
 * @returns {boolean} returns.isCopied - Whether the text was successfully copied
 * @returns {(text: string) => void} returns.copyToClipboard - Function to copy text to clipboard
 * 
 * @example
 * ```tsx
 * const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 3000 });
 * 
 * return (
 *   <button onClick={() => copyToClipboard("Text to copy")}>
 *     {isCopied ? "Copied!" : "Copy"}
 *   </button>
 * );
 * ```
 */
export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    void navigator.clipboard.writeText(value)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      })
      .catch(() => {
        setIsCopied(false)
      })
  }

  return { isCopied, copyToClipboard }
}
