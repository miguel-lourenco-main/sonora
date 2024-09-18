import { useCallback, useEffect, useState } from "react"
import { useIsRightSidebarOpen } from "../lib/hooks/use-open-files"

export function FillerComponent() {

    const [shrinkSize, setShrinkSize] = useState(530)

    const { isRightSidebarOpen } = useIsRightSidebarOpen()

    const updateShrinkSize = useCallback(() => {
        const windowWidth = window.innerWidth
        if (windowWidth < 1620) {
        setShrinkSize(530 - (1640 - windowWidth))
        } else {
        setShrinkSize(530)
        }
    }, [])

    useEffect(() => {
        updateShrinkSize()
        window.addEventListener('resize', updateShrinkSize)
        return () => window.removeEventListener('resize', updateShrinkSize)
    }, [updateShrinkSize])

    return(
        <div 
            style={{width: isRightSidebarOpen ? `${shrinkSize}px` : '0px'}}
            className={"block ease-in-out transition-all duration-300"}
        />
    )
}