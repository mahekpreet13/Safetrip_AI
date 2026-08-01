import { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import { useRecentSearches } from '../hooks/useRecentSearches.js'
import { searchLocation } from '../services/api.js'

const accentMap = {
  blue: { ring: 'focus:ring-blue-500', btn: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300', pill: 'text-blue-600' },
  emerald: { ring: 'focus:ring-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300', pill: 'text-emerald-600' },
}

export default function SearchBar({ onSearchResult, accent = 'blue' }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { recentSearches, addSearch } = useRecentSearches()
  const theme = accentMap[accent] || accentMap.blue

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a location (e.g. Delhi, Chicago)"
            className={`w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${theme.ring}`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${theme.btn} text-white text-sm font-semibold px-7 py-3 rounded-xl shadow-sm transition`}
        >
          {loading ? 'Searching...' : 'Search Location'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {recentSearches.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(item)
                  runSearch(item)
                }}
                className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-3 py-1.5 rounded-full transition"
              >
                <Clock size={12} className={theme.pill} />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}