import { useState, useEffect } from 'react'

const STORAGE_KEY = 'safetrip_recent_searches'
const MAX_RECENT = 5

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch {
      // If localStorage is unavailable or data is corrupted, just start fresh
      setRecentSearches([])
    }
  }, [])

  const addSearch = (query) => {
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Fail silently — recent searches just won't persist this session
      }
      return updated
    })
  }

  return { recentSearches, addSearch }
}