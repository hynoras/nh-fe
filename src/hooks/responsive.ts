import { RefObject, useEffect, useState } from "react"

/**
 * Hook to calculate responsive height of an element based on its position
 * and the viewport height. Automatically updates on window resize.
 *
 * @param ref - Reference to the target element
 * @param bottomPadding - Padding from the bottom of the viewport (default: 20)
 * @returns The calculated height in pixels
 */
export const useResponsiveHeight = (
  ref: RefObject<HTMLElement | null>,
  bottomPadding: number = 20
): number => {
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!ref.current) return

    const updateHeight = () => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        const topOffset = rect.top
        const calculated = window.innerHeight - topOffset - bottomPadding
        setHeight(calculated)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [ref, bottomPadding])

  return height
}
