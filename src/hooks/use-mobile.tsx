
import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Changed from 768 to 640 (sm breakpoint)

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return
    
    // Define the media query
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Define handler function
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Initial check
    handleResize(mql)
    
    // Add event listener
    if (mql.addEventListener) {
      mql.addEventListener('change', handleResize)
      return () => mql.removeEventListener('change', handleResize)
    } else {
      // Fallback for older browsers
      const resizeHandler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      window.addEventListener('resize', resizeHandler)
      return () => window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return isMobile
}
