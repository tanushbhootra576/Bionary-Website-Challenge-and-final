import { createContext, useContext } from 'react'

const SmoothScrollContext = createContext()

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext)
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }
  return context
}

export const SmoothScrollProvider = ({ children }) => {
  return (
    <SmoothScrollContext.Provider value={{ lenis: null }}>
      {children}
    </SmoothScrollContext.Provider>
  )
} 