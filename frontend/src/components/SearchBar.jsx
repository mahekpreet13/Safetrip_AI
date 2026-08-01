import { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import { useRecentSearches } from '../hooks/useRecentSearches.js'
import { searchLocation } from '../services/api.js'

export default function SearchBar({ onSearchResult, accent = 'signal' }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { recentSearches, addSearch } = useRecentSearches()

  const runSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

    try {
      const result = await searchLocation(trimmed)
      addSearch(trimmed)
      onSearchResult(result)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch(query)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a location (e.g. Delhi, Chicago)"
            className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-signal hover:bg-signal-dark disabled:opacity-60 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg transition whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Search Location'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-300">{error}</p>
      )}

      {recentSearches.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-mono text-paper/50 uppercase tracking-widest mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(item)
                  runSearch(item)
                }}
                className="flex items-center gap-1.5 text-xs text-paper/80 bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-full transition"
              >
                <Clock size={12} className="text-signal" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}